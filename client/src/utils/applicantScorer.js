// Client-side Automatic Applicant Scoring System
// Filters and scores job applicants based on qualifications

/**
 * Calculate applicant score for a job
 * @param {Object} applicant - Applicant profile data
 * @param {Object} job - Job posting with requirements
 * @returns {Object} { score: number, eligible: boolean, breakdown: Object }
 */
export function calculateApplicantScore(applicant, job) {
  let totalPoints = 0;
  let maxPoints = 0;
  const breakdown = {};

  // 1. ACADEMIC PERFORMANCE (30 points)
  maxPoints += 30;
  let academicScore = 0;

  if (applicant.averageGrade || applicant.gpa) {
    const grade = applicant.averageGrade || applicant.gpa || 0;
    
    if (grade >= 80) {
      academicScore = 30; // Excellent
    } else if (grade >= 70) {
      academicScore = 25; // Very Good
    } else if (grade >= 60) {
      academicScore = 20; // Good
    } else if (grade >= 50) {
      academicScore = 15; // Average
    } else {
      academicScore = 10; // Below Average
    }
  } else if (applicant.results && Array.isArray(applicant.results)) {
    // Calculate from subject results
    const totalGrade = applicant.results.reduce((sum, result) => {
      const grade = typeof result === 'object' ? (result.grade || result.mark || 0) : 0;
      return sum + parseFloat(grade);
    }, 0);
    const avgGrade = applicant.results.length > 0 ? totalGrade / applicant.results.length : 0;
    
    if (avgGrade >= 80) academicScore = 30;
    else if (avgGrade >= 70) academicScore = 25;
    else if (avgGrade >= 60) academicScore = 20;
    else if (avgGrade >= 50) academicScore = 15;
    else academicScore = 10;
  } else {
    academicScore = 15; // Default if no grades available
  }

  totalPoints += academicScore;
  breakdown.academicPerformance = {
    score: academicScore,
    max: 30,
    details: `Grade: ${applicant.averageGrade || applicant.gpa || 'N/A'}`
  };

  // 2. EXTRA CERTIFICATES (20 points)
  maxPoints += 20;
  let certificateScore = 0;

  const certificates = applicant.certificates || applicant.certifications || [];
  if (certificates.length > 0) {
    certificateScore = Math.min(certificates.length * 5, 20); // 5 points per certificate, max 20
  }

  totalPoints += certificateScore;
  breakdown.certificates = {
    score: certificateScore,
    max: 20,
    details: `${certificates.length} certificate(s)`
  };

  // 3. WORK EXPERIENCE (25 points)
  maxPoints += 25;
  let experienceScore = 0;

  const experience = applicant.workExperience || applicant.experience || [];
  const yearsOfExperience = applicant.yearsOfExperience || 0;

  if (yearsOfExperience >= 5) {
    experienceScore = 25; // 5+ years
  } else if (yearsOfExperience >= 3) {
    experienceScore = 20; // 3-4 years
  } else if (yearsOfExperience >= 1) {
    experienceScore = 15; // 1-2 years
  } else if (experience.length > 0) {
    experienceScore = 10; // Has some experience
  } else {
    experienceScore = 5; // Entry level
  }

  // Check if experience is in relevant field
  if (job.industry && experience.length > 0) {
    const relevantExp = experience.some(exp => {
      const expIndustry = (exp.industry || exp.field || '').toLowerCase();
      const jobIndustry = job.industry.toLowerCase();
      return expIndustry.includes(jobIndustry) || jobIndustry.includes(expIndustry);
    });
    
    if (relevantExp) {
      experienceScore = Math.min(experienceScore + 5, 25); // Bonus for relevant experience
    }
  }

  totalPoints += experienceScore;
  breakdown.workExperience = {
    score: experienceScore,
    max: 25,
    details: `${yearsOfExperience} year(s), ${experience.length} position(s)`
  };

  // 4. RELEVANCE TO JOB (25 points)
  maxPoints += 25;
  let relevanceScore = 0;

  // Check education field relevance
  const applicantField = (applicant.fieldOfStudy || applicant.major || applicant.degreeField || '').toLowerCase();
  const jobTitle = (job.title || '').toLowerCase();
  const jobDescription = (job.description || '').toLowerCase();
  const jobRequirements = job.requirements || {};

  // Direct field match
  if (applicantField) {
    const keywords = applicantField.split(' ');
    const titleMatch = keywords.some(keyword => 
      keyword.length > 3 && (jobTitle.includes(keyword) || jobDescription.includes(keyword))
    );
    
    if (titleMatch) {
      relevanceScore += 15;
    }
  }

  // Required qualifications match
  const requiredEducation = jobRequirements.education || jobRequirements.minimumEducation || '';
  const applicantEducation = applicant.educationLevel || applicant.highestQualification || '';

  const educationLevels = {
    'Certificate': 1,
    'Diploma': 2,
    'Bachelor': 3,
    'Undergraduate': 3,
    'Masters': 4,
    'Postgraduate': 4,
    'Doctorate': 5,
    'PhD': 5
  };

  const applicantLevel = educationLevels[applicantEducation] || 0;
  const requiredLevel = educationLevels[requiredEducation] || 0;

  if (applicantLevel >= requiredLevel) {
    relevanceScore += 10;
  }

  totalPoints += relevanceScore;
  breakdown.relevance = {
    score: relevanceScore,
    max: 25,
    details: `Field: ${applicantField || 'N/A'}`
  };

  // Calculate final percentage
  const percentageScore = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  const eligible = percentageScore >= 60; // Need 60% to be considered qualified

  return {
    score: Math.round(percentageScore),
    rawScore: totalPoints,
    maxScore: maxPoints,
    eligible,
    breakdown,
    recommendation: getRecommendation(percentageScore)
  };
}

/**
 * Get recommendation based on score
 */
export function getRecommendation(score) {
  if (score >= 85) return 'Excellent Match';
  if (score >= 75) return 'Very Good Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Potential Match';
  return 'Below Requirements';
}

/**
 * Filter applicants to show only qualified ones
 * @param {Array} applicants - List of applicants
 * @param {Object} job - Job posting
 * @returns {Array} Filtered and scored applicants
 */
export function filterQualifiedApplicants(applicants, job) {
  if (!applicants || !Array.isArray(applicants)) return [];
  
  return applicants
    .map(applicant => {
      const scoring = calculateApplicantScore(applicant, job);
      return {
        ...applicant,
        matchScore: scoring.score,
        matchBreakdown: scoring.breakdown,
        recommendation: scoring.recommendation,
        isQualified: scoring.eligible
      };
    })
    .filter(applicant => applicant.isQualified) // Only show qualified (60%+)
    .sort((a, b) => b.matchScore - a.matchScore); // Sort by score descending
}
