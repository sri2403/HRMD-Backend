# HRMD-Backend

## Overview
The HRMD-Backend API provides comprehensive functionalities for HR and administrative tasks. It includes endpoints for admin, job, candidate, and employee management, supporting operations such as registration, authentication, profile management, job postings, and employee lifecycle processes like leave management and payroll. Accessible via a Render platform link, the API documentation on Postman offers detailed guidance for integration. This robust system facilitates seamless HR operations through secure authentication mechanisms and efficient data management capabilities.

## API documentation:
view here=> https://documenter.getpostman.com/view/32019732/2sA3XY7deg

## Render Link:
Ouput link=> https://hrmd-backend.onrender.com

## API Endpoints
### Admin Endpoints
- POST /adminReg - Register a new admin.
- POST /adminLogin - Authenticate and login as an admin.
- POST /adminForgotPassword - Request a password reset for admin.
- GET /adminAuth/:adminId - Authenticate an admin with ID (admin authentication middleware).

### Job Management Endpoints
- POST /createJobpost - Create a new job post.
- GET /getAllJobs - Retrieve all job posts.

### Admin Management Endpoints
- GET /getAllAdmin - Retrieve all admins.

### Candidate Endpoints
- POST /candidateReg - Register a new candidate.
- POST /candidateLogin - Authenticate and login as a candidate.
- POST /candidateForgotPassword - Request a password reset for candidate.
- GET /getCandidateById/:id - Retrieve a candidate by ID.
- PUT /updateCandidate/:id - Update a candidate's information.
- GET /getAllCandidates - Retrieve all candidates.
- POST /applyJob - Apply for a job.
- GET /candidatesWithJob - Retrieve candidates associated with jobs.
- POST /candidateHired/:id - Mark a candidate as hired.
- POST /candidateRejected/:id - Mark a candidate as rejected.
- GET /candidateAuth/:candidateId - Authenticate a candidate with ID (candidate authentication middleware).

### Employee Endpoints
- POST /employeeReg - Register a new employee.
- POST /employeeLogin - Authenticate and login as an employee.
- POST /employeeForgotPassword - Request a password reset for employee.
- GET /getAllEmployees - Retrieve all employees.
- GET /getEmployee/:id - Retrieve an employee by ID.
- POST /createEmployee - Create a new employee.
- PUT /updateEmployee/:id - Update an employee's information.
- DELETE /deleteEmployee/:id - Delete an employee.
- POST /applyLeave/:id - Apply for leave.
- GET /getLeaveRequests - Retrieve leave requests.
- PUT /approve/:id - Approve leave request.
- PUT /reject/:id - Reject leave request.
- POST /recordAttendance/:id - Record attendance for an employee.
- GET /getAttendanceList - Retrieve attendance records.
- POST /giveFeedback/:id - Give feedback to an employee.
- POST /pay/:id - Process payment for an employee.
- GET /getAllEmployeesWithPaystatus - Retrieve all employees with pay status.
- GET /employeeAuth/:employeeId - Authenticate an employee with ID (employee authentication middleware).
