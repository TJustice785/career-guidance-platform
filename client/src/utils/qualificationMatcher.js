/**
 * Qualification Matcher Utility
 * Matches student qualifications with course/job requirements
 */

// Grade to points mapping (Lesotho system)
const gradePoints = {
  'A': 5,
  'A*': 5,
  'B': 4,
  'C': 3,
  'D': 2,
  'E': 1,
  'F': 0
};

/**
 * Calculate total points (credits) from student grades
 * Each subject grade contributes points: A=5, B=4, C=3, D=2, E=1, F=0
 */
export const calculatePoints = (subjects = []) => {
  if (!Array.isArray(subjects)) return 0;
  
  let totalPoints = 0;
  subjects.forEach(subject => {
    if (typeof subject === 'string') {
      // Try to extract grade from string like "Mathematics - A"
      const grade = subject.split('-').pop()?.trim().toUpperCase();
      totalPoints += gradePoints[grade] || 0;
    } else if (subject.grade) {
      totalPoints += gradePoints[subject.grade.toUpperCase()] || 0;
    }
  });
  
  return totalPoints;
};

/**
 * Calculate academic credits (total subjects passed with C or better)
 */
export const calculateCredits = (subjects = []) => {
  if (!Array.isArray(subjects)) return 0;
  
  let credits = 0;
  subjects.forEach(subject => {
    let grade = '';
    if (typeof subject === 'string') {
      grade = subject.split('-').pop()?.trim().toUpperCase();
    } else if (subject.grade) {
      grade = subject.grade.toUpperCase();
    }
    
    // Count subjects with C grade or better (3+ points)
    if (gradePoints[grade] >= 3) {
      credits++;
    }
  });
  
  return credits;
};

/**
 * Get highest grade from student's subjects
 */
export const getHighestGrade = (subjects = []) => {
  if (!Array.isArray(subjects) || subjects.length === 0) return 'E';
  
  const grades = subjects.map(subject => {
    if (typeof subject === 'string') {
      return subject.split('-').pop()?.trim().toUpperCase();
    } else if (subject.grade) {
      return subject.grade.toUpperCase();
    }
    return 'E';
  });
  
  // Find highest grade
  const gradeOrder = ['A*', 'A', 'B', 'C', 'D', 'E', 'F'];
  for (const grade of gradeOrder) {
    if (grades.includes(grade)) return grade;
  }
  
  return 'E';
};

/**
 * Extract subject names from student's subjects
 */
export const getSubjectNames = (subjects = []) => {
  if (!Array.isArray(subjects)) return [];
  
  return subjects.map(subject => {
    if (typeof subject === 'string') {
      return subject.split('-')[0]?.trim().toLowerCase();
    } else if (subject.name) {
      return subject.name.toLowerCase();
    }
    return '';
  }).filter(name => name);
};

/**
 * Check if student meets minimum grade requirement
 */
export const meetsGradeRequirement = (studentGrade, requiredGrade) => {
  const studentPoints = gradePoints[studentGrade.toUpperCase()] || 0;
  const requiredPoints = gradePoints[requiredGrade.toUpperCase()] || 0;
  return studentPoints >= requiredPoints;
};

/**
 * Check if student has required subjects
 */
export const hasRequiredSubjects = (studentSubjects = [], requiredSubjects = []) => {
  if (!Array.isArray(requiredSubjects) || requiredSubjects.length === 0) return true;
  if (!Array.isArray(studentSubjects) || studentSubjects.length === 0) return false;
  
  const studentSubjectNames = getSubjectNames(studentSubjects);
  
  let matchedCount = 0;
  for (const required of requiredSubjects) {
    const requiredLower = required.toLowerCase().trim();
    
    // Check for OR conditions (e.g., "Mathematics OR Physical Science")
    if (requiredLower.includes(' or ')) {
      const options = requiredLower.split(' or ').map(opt => opt.trim());
      const hasAny = options.some(opt => 
        studentSubjectNames.some(studentSubj => studentSubj.includes(opt) || opt.includes(studentSubj))
      );
      if (hasAny) matchedCount++;
    } else {
      // Check if student has this subject
      const hasSubject = studentSubjectNames.some(studentSubj => 
        studentSubj.includes(requiredLower) || requiredLower.includes(studentSubj)
      );
      if (hasSubject) matchedCount++;
    }
  }
  
  // Student must have at least 2/3 of required subjects, or all if less than 3
  const threshold = requiredSubjects.length <= 2 ? requiredSubjects.length : Math.floor(requiredSubjects.length * 0.67);
  return matchedCount >= threshold;
};

/**
 * Check if student meets course requirements
 */
export const meetsRequirements = (studentData, requirements) => {
  if (!requirements) return { eligible: true, score: 100, reasons: [] };
  
  const reasons = [];
  let score = 0;
  let totalChecks = 0;
  
  const studentCredits = calculateCredits(studentData.subjects);
  const studentPoints = calculatePoints(studentData.subjects);
  const studentGrade = getHighestGrade(studentData.subjects);
  
  // Check minimum credits
  if (requirements.minimumCredits) {
    totalChecks++;
    if (studentCredits >= requirements.minimumCredits) {
      score += 25;
      reasons.push(`✓ Credits requirement met (${studentCredits} ≥ ${requirements.minimumCredits} credits)`);
    } else {
      reasons.push(`✗ Not enough credits (${studentCredits} < ${requirements.minimumCredits} credits)`);
    }
  }
  
  // Check minimum grade
  if (requirements.minimumGrade) {
    totalChecks++;
    if (meetsGradeRequirement(studentGrade, requirements.minimumGrade)) {
      score += 25;
      reasons.push(`✓ Grade requirement met (${studentGrade} ≥ ${requirements.minimumGrade})`);
    } else {
      reasons.push(`✗ Grade too low (${studentGrade} < ${requirements.minimumGrade})`);
    }
  }
  
  // Check minimum points
  if (requirements.minimumPoints) {
    totalChecks++;
    if (studentPoints >= requirements.minimumPoints) {
      score += 25;
      reasons.push(`✓ Points requirement met (${studentPoints} ≥ ${requirements.minimumPoints})`);
    } else {
      reasons.push(`✗ Not enough points (${studentPoints} < ${requirements.minimumPoints})`);
    }
  }
  
  // Check required subjects
  if (requirements.subjects && requirements.subjects.length > 0) {
    totalChecks++;
    if (hasRequiredSubjects(studentData.subjects, requirements.subjects)) {
      score += 25;
      reasons.push(`✓ Has required subjects`);
    } else {
      reasons.push(`✗ Missing required subjects: ${requirements.subjects.join(', ')}`);
    }
  }
  
  // If no specific requirements, check general eligibility
  if (totalChecks === 0) {
    totalChecks = 1;
    score = 100;
  }
  
  // Calculate percentage score
  const percentageScore = totalChecks > 0 ? Math.round((score / (totalChecks * 25)) * 100) : 100;
  const eligible = percentageScore >= 70; // Need at least 70% match
  
  return {
    eligible,
    score: percentageScore,
    reasons,
    details: {
      studentGrade,
      studentPoints,
      studentCredits,
      studentSubjects: getSubjectNames(studentData.subjects)
    }
  };
};

/**
 * Check if student qualifies for a job
 */
export const qualifiesForJob = (studentData, jobRequirements) => {
  if (!jobRequirements) return { eligible: true, score: 100, reasons: [] };
  
  const reasons = [];
  let score = 100;
  
  // Check education level
  if (jobRequirements.educationLevel) {
    const studentLevel = studentData.currentGrade || '';
    const requiredLevel = jobRequirements.educationLevel.toLowerCase();
    
    // Map student grade to education level
    const levelMap = {
      'form a': 'high school',
      'form b': 'high school',
      'form c': 'high school',
      'form d': 'high school',
      'form e': 'high school',
      'diploma': 'diploma',
      'degree': 'degree',
      'bachelor': 'degree',
      'masters': 'postgraduate',
      'phd': 'postgraduate'
    };
    
    const studentLevelNorm = levelMap[studentLevel.toLowerCase()] || 'high school';
    
    if (requiredLevel.includes('degree') && !studentLevelNorm.includes('degree')) {
      score -= 50;
      reasons.push(`✗ Degree required (you have: ${studentLevel})`);
    } else if (requiredLevel.includes('diploma') && studentLevelNorm === 'high school') {
      score -= 30;
      reasons.push(`⚠ Diploma preferred (you have: ${studentLevel})`);
    } else {
      reasons.push(`✓ Education level acceptable`);
    }
  }
  
  // Check skills
  if (jobRequirements.skills && jobRequirements.skills.length > 0) {
    const studentSkills = (studentData.skills || []).map(s => s.toLowerCase());
    const requiredSkills = jobRequirements.skills.map(s => s.toLowerCase());
    
    const matchedSkills = requiredSkills.filter(req => 
      studentSkills.some(stud => stud.includes(req) || req.includes(stud))
    );
    
    const skillMatchPercent = (matchedSkills.length / requiredSkills.length) * 100;
    
    if (skillMatchPercent >= 50) {
      reasons.push(`✓ ${matchedSkills.length}/${requiredSkills.length} required skills`);
    } else {
      score -= 20;
      reasons.push(`⚠ Missing key skills: ${requiredSkills.filter(s => !matchedSkills.includes(s)).join(', ')}`);
    }
  }
  
  // Check experience
  if (jobRequirements.experience) {
    const yearsRequired = parseInt(jobRequirements.experience) || 0;
    const studentExperience = (studentData.workExperience || []).length;
    
    if (studentExperience >= yearsRequired) {
      reasons.push(`✓ Experience requirement met`);
    } else if (yearsRequired > 0) {
      score -= 15;
      reasons.push(`⚠ Limited experience (${studentExperience} vs ${yearsRequired} years)`);
    }
  }
  
  const eligible = score >= 60;
  
  return {
    eligible,
    score,
    reasons
  };
};

/**
 * Get recommended courses for a student
 */
export const getRecommendedCourses = (studentData, courses = []) => {
  if (!studentData || !Array.isArray(courses)) return [];
  
  return courses
    .map(course => {
      const match = meetsRequirements(studentData, course.requirements);
      return {
        ...course,
        matchScore: match.score,
        eligible: match.eligible,
        matchReasons: match.reasons,
        matchDetails: match.details
      };
    })
    .filter(course => course.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Get recommended jobs for a student
 */
export const getRecommendedJobs = (studentData, jobs = []) => {
  if (!studentData || !Array.isArray(jobs)) return [];
  
  return jobs
    .map(job => {
      const match = qualifiesForJob(studentData, job.requirements);
      return {
        ...job,
        matchScore: match.score,
        eligible: match.eligible,
        matchReasons: match.reasons
      };
    })
    .filter(job => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Check if student can apply to a course
 */
export const canApplyToCourse = (studentData, course) => {
  const match = meetsRequirements(studentData, course.requirements);
  return {
    canApply: match.eligible,
    message: match.eligible 
      ? 'You meet the requirements for this course!' 
      : 'You do not meet all requirements for this course.',
    reasons: match.reasons,
    score: match.score
  };
};

/**
 * Check if student can apply to a job
 */
export const canApplyToJob = (studentData, job) => {
  const match = qualifiesForJob(studentData, job.requirements);
  return {
    canApply: match.eligible,
    message: match.eligible 
      ? 'You qualify for this job!' 
      : 'You may not fully qualify for this job.',
    reasons: match.reasons,
    score: match.score
  };
};

export default {
  calculatePoints,
  calculateCredits,
  getHighestGrade,
  getSubjectNames,
  meetsGradeRequirement,
  hasRequiredSubjects,
  meetsRequirements,
  qualifiesForJob,
  getRecommendedCourses,
  getRecommendedJobs,
  canApplyToCourse,
  canApplyToJob
};
