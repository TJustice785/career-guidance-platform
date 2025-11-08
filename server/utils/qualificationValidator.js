// Server-side qualification validation
// This ensures students cannot bypass frontend checks via direct API calls

/**
 * Check if student meets course requirements
 * @param {Object} studentData - Student profile data
 * @param {Object} courseRequirements - Course requirements
 * @returns {Object} { eligible: boolean, score: number, reasons: string[] }
 */
function meetsRequirements(studentData, courseRequirements) {
  if (!courseRequirements || Object.keys(courseRequirements).length === 0) {
    return { eligible: true, score: 100, reasons: ['No specific requirements'] };
  }

  const reasons = [];
  let totalPoints = 0;
  let achievedPoints = 0;

  // 1. Check Education Level (40 points)
  totalPoints += 40;
  const educationLevel = studentData?.educationLevel || studentData?.highestQualification;
  const requiredLevel = courseRequirements.minimumEducationLevel || courseRequirements.level;
  
  const levelHierarchy = {
    'Primary': 1,
    'JC': 2,
    'COSC': 3,
    'High School': 3,
    'Diploma': 4,
    'Certificate': 4,
    'Undergraduate': 5,
    'Bachelor': 5,
    'Masters': 6,
    'Postgraduate': 6,
    'Doctorate': 7,
    'PhD': 7
  };

  const studentLevelValue = levelHierarchy[educationLevel] || 0;
  const requiredLevelValue = levelHierarchy[requiredLevel] || 0;

  if (studentLevelValue >= requiredLevelValue) {
    achievedPoints += 40;
    reasons.push(`✓ Meets education level requirement (${educationLevel})`);
  } else {
    reasons.push(`✗ Education level insufficient (have: ${educationLevel}, need: ${requiredLevel})`);
  }

  // 2. Check Subjects (30 points)
  totalPoints += 30;
  if (courseRequirements.requiredSubjects && courseRequirements.requiredSubjects.length > 0) {
    const studentSubjects = (studentData?.subjects || []).map(s => 
      typeof s === 'string' ? s.toLowerCase() : s?.name?.toLowerCase()
    );
    
    const requiredSubjects = courseRequirements.requiredSubjects.map(s => s.toLowerCase());
    const matchingSubjects = requiredSubjects.filter(req => 
      studentSubjects.some(student => student.includes(req) || req.includes(student))
    );

    const subjectScore = (matchingSubjects.length / requiredSubjects.length) * 30;
    achievedPoints += subjectScore;

    if (subjectScore >= 20) {
      reasons.push(`✓ Has ${matchingSubjects.length}/${requiredSubjects.length} required subjects`);
    } else {
      reasons.push(`✗ Missing key subjects (${requiredSubjects.join(', ')})`);
    }
  } else {
    achievedPoints += 30; // No specific subjects required
  }

  // 3. Check Minimum Grade/Points (30 points)
  totalPoints += 30;
  if (courseRequirements.minimumGrade || courseRequirements.minimumPoints) {
    const studentGrade = studentData?.averageGrade || studentData?.points || 0;
    const requiredGrade = courseRequirements.minimumGrade || courseRequirements.minimumPoints || 0;

    if (studentGrade >= requiredGrade) {
      achievedPoints += 30;
      reasons.push(`✓ Meets grade requirement (${studentGrade})`);
    } else {
      reasons.push(`✗ Grade below requirement (have: ${studentGrade}, need: ${requiredGrade})`);
    }
  } else {
    achievedPoints += 30; // No specific grade required
  }

  const percentageScore = totalPoints > 0 ? (achievedPoints / totalPoints) * 100 : 100;
  const eligible = percentageScore >= 70; // Need 70% match to be eligible

  return {
    eligible,
    score: Math.round(percentageScore),
    reasons,
    details: {
      totalPoints,
      achievedPoints,
      percentageScore: Math.round(percentageScore)
    }
  };
}

/**
 * Validate if student can apply to course
 * @param {Object} studentData - Student profile
 * @param {Object} course - Course data with requirements
 * @returns {Object} { canApply: boolean, message: string, reasons: string[], score: number }
 */
function validateApplication(studentData, course) {
  // Check if student has completed tertiary level
  if (studentData?.hasCompletedStudies === true || 
      studentData?.educationLevel === 'Bachelor' || 
      studentData?.educationLevel === 'Masters' ||
      studentData?.educationLevel === 'Doctorate') {
    return {
      canApply: false,
      message: 'You have completed tertiary education and cannot apply for additional undergraduate programs.',
      reasons: ['Already holds a tertiary qualification'],
      score: 0
    };
  }

  // Check requirements
  const match = meetsRequirements(studentData, course.requirements);

  return {
    canApply: match.eligible,
    message: match.eligible 
      ? 'You meet the requirements for this course!' 
      : 'You do not meet all requirements for this course.',
    reasons: match.reasons,
    score: match.score
  };
}

module.exports = {
  meetsRequirements,
  validateApplication
};
