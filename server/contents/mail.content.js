// emailTemplates.js

const credentialsPushMail = {
    subject: "Login Credentials for Website – RI District 3170",
    body: `
Dear Club Secretary,

Greetings from Rotary International District 3170!

We’re excited to have you onboard for the Rotary International Year 2025–26.
As part of the district reporting system, each Club Secretary has been provided with individual login credentials to access the reporting portal.

Please find your credentials below:

Username/Email: \${email}
Password: \${password}

Steps to Login:
* Visit the official portal: https://rotaractdistrict3170.vercel.app
* Click on the Secretary Login tab on the homepage
* Enter your email and password
You will now be logged in

Important Notes:
• You are advised to reset your password to one of your choice after the first login.
• In case you forget your password, you can use the original password provided above as authentication to reset it.

Report Submission Guidelines:
* Submit your club’s monthly report in PDF format only
* Ensure the file size is under 25MB

Timely submission will help ensure smooth district-level documentation and recognition.
This system is designed to streamline reporting and maintain efficient communication between clubs and the district.

If you face any issues during login or submission, please feel free to get in touch with the District Rotaract Secretary.

Let’s unite for good, lead with virtue, and be the Abhiram this world needs.

Warm regards,
PHF Rtn Rtr Harshit Kulkarni
District Rotaract Secretary
RI District 3170 | RY 2025-26
`.trim(),
};

export { credentialsPushMail };
