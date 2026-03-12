import pandas as pd
import numpy as np

np.random.seed(42)
N = 2000

# ── Salary base by job title ───────────────────────────────
job_salary_base = {
    "Software Engineer":          85000,
    "Senior Software Engineer":  120000,
    "Data Scientist":            100000,
    "Senior Data Scientist":     135000,
    "Machine Learning Engineer": 115000,
    "Data Analyst":               65000,
    "Senior Data Analyst":        90000,
    "Data Engineer":             105000,
    "DevOps Engineer":           100000,
    "Cloud Architect":           135000,
    "Frontend Developer":         80000,
    "Backend Developer":          85000,
    "Full Stack Developer":       90000,
    "Mobile Developer":           85000,
    "Cybersecurity Analyst":      95000,
    "Product Manager":           110000,
    "Senior Product Manager":    145000,
    "Project Manager":            85000,
    "Scrum Master":               90000,
    "Business Analyst":           70000,
    "Financial Analyst":          72000,
    "Senior Financial Analyst":   95000,
    "Investment Banker":         130000,
    "Accountant":                 60000,
    "Senior Accountant":          80000,
    "Marketing Manager":          80000,
    "Digital Marketing Specialist": 58000,
    "Content Strategist":         62000,
    "Brand Manager":              85000,
    "Sales Manager":              90000,
    "Sales Representative":       50000,
    "Account Executive":          70000,
    "Business Development Manager": 95000,
    "HR Manager":                 78000,
    "HR Specialist":              55000,
    "Recruiter":                  58000,
    "Operations Manager":         90000,
    "Supply Chain Manager":       88000,
    "Logistics Coordinator":      52000,
    "UX Designer":                82000,
    "UI Designer":                78000,
    "Graphic Designer":           55000,
    "Research Scientist":        105000,
    "Biomedical Engineer":        88000,
    "Mechanical Engineer":        82000,
    "Electrical Engineer":        88000,
    "Civil Engineer":             78000,
    "Chemical Engineer":          85000,
    "Director of Engineering":   160000,
    "VP of Engineering":         200000,
    "CTO":                       240000,
    "CEO":                       280000,
    "CFO":                       230000,
    "COO":                       220000,
    "Director":                  150000,
    "VP":                        180000,
    "Manager":                    80000,
    "Senior Manager":            110000,
    "Junior Developer":           52000,
    "Intern":                     38000,
}

edu_multiplier = {
    "High School":  0.80,
    "Bachelor's":   1.00,
    "Master's":     1.18,
    "PhD":          1.35,
}

gender_list    = ["Male", "Female"]
edu_list       = list(edu_multiplier.keys())
job_list       = list(job_salary_base.keys())

# ── Generate records ───────────────────────────────────────
rows = []
for _ in range(N):
    job    = np.random.choice(job_list)
    gender = np.random.choice(gender_list)
    edu    = np.random.choice(edu_list, p=[0.10, 0.50, 0.28, 0.12])
    exp    = max(0, int(np.random.exponential(scale=7)))
    exp    = min(exp, 40)

    # age depends on experience
    age = max(22, min(65, exp + int(np.random.normal(24, 2))))

    base   = job_salary_base[job]
    salary = (
        base
        * edu_multiplier[edu]
        * (1 + 0.035 * exp)                    # 3.5 % raise per year
        * np.random.normal(1.0, 0.07)           # ±7 % noise
    )
    salary = max(30000, round(salary / 500) * 500)   # round to $500

    rows.append([age, gender, edu, job, exp, int(salary)])

df = pd.DataFrame(rows, columns=[
    "Age", "Gender", "Education Level", "Job Title",
    "Years of Experience", "Salary"
])
df.to_csv("/home/claude/salary-v2/data/salary_data.csv", index=False)
print(f"Generated {len(df)} rows")
print(df.describe())
print(df["Education Level"].value_counts())
