const balanceDueSubject = `{title} Registration {lastname}`;
const balanceDueBodyHTML = `<div class="text-div">
<label>Class</label>
<span class="text">{title}</span>

<label>Name</label>
<span class="text">{firstname} {lastname}</span>
</div>

<label>Registration Date</label>
<span class="text">{created}</span>

<label>Address</label>
<span class="text">{address}</span>

<label>Phone</label>
<span class="text">{phone_number}</span>

<label>Email</label>
<span class="text">{email}</span>

<label>Tuition</label>
<span class="text">{cost}</span>

<label>Amount Paid</label>
<span class="text">{paid}</span>

<label>Balance Due</label>
<span class="text">{due}</span>
</div>

{firstname}, {lastname}, {created}, {address}, {phone_number}, {email}, {title}, {cost}, {paid}, {due}`;

const balanceDueBodyText = `{firstname}	First Name	Field "field_first_name".
{lastname}	Last Name	Field "field_last_name".
{created} Registration Date
{address}	Address	Field "field_address".
{phone_number}	Phone	Field "field_phone".
{firstname}	First Name	Text field.
{lastname}	Last Name	Text field.
{address}	Address	Postal address field.
{phone_number}	Phone	Telephone number field.
{cost} Tuition      Tuition owed
{paid} Amount      Amount Paid
{due} Balance      Balance Due

test, {firstname}, {lastname}, {created}, {phone_number}, {email}, {title}, {cost}, {paid}, {due}`;

const balancePaymentSubject = "Balance due for {classType} {lastname}";
const balancePaymentBody =
  'Please pay your balance of ${amount} for {title} at the link below:<a href="{base_url}/balance?amount={amount}&firstname={firstname}&lastname={lastname}"> Pay your balance securely here</a>';
const cashPaySubject = `Payment arrangement for 3Bs Captains School`;
const cashPayBodyHTML = `You have elected to make payment arrangements without using a credit card. Contact Capt. Ross @ 910-547-3689 or <a href="mailto:rossfowle@gmail.com">email</a>

<center><strong>Be advised that registration is not confirmed until payment have been made.</strong></center>`;
const cashPayBodyText = `You have elected to make payment arrangements without using a credit card. Contact Capt. Ross @ 910-547-3689 or <a href="mailto:rossfowle@gmail.com">email</a>

Be advised that registration is not confirmed until payment have been made.`;
const registrationSubject = `Thank you for registering for 3Bs Captains School {class_type} course! `;
const registrationBodyHTML = `<p>This course begins on {date} Attendance at all sessions is mandatory to receive a certificate.</p>

<p><span style="font-size:14px"><span style="color:#FF0000"><strong>Your instructor for this course is {captain}. The class will be held at {classroom_location}. </strong></span></span></p>

<p>I have included links the Coast Guard checklist and required license application forms. You are not required to have these complete prior to class, but it is a good idea to get a head start on the application process.</p>
<p<a href=https://www.dco.uscg.mil/Portals/9/NMC/pdfs/checklists/mcp_fm_nmc5_31_web.pdf>OUPV requirements</a>
<a href=https://www.dco.uscg.mil/Portals/9/NMC/pdfs/forms/CG_719B.pdf>Application (719 Bravo)</a> 
<a href=https://www.dco.uscg.mil/Portals/9/NMC/pdfs/forms/CG_719K.pdf>Physical (719 Kilo)</a> 
<a href=https://www.dco.uscg.mil/Portals/9/NMC/pdfs/forms/CG_719C.pdf>Conviction record if necessary (719 Charlie)</a>  
<a href=https://www.dco.uscg.mil/Portals/9/NMC/pdfs/forms/CG_719S.pdf>Small boat experience form (719 Sierra)</a> 
<a href=https://www.dco.uscg.mil/Portals/9/NMC/pdfs/forms/CG_719P.pdf>Drug testing form (719 Papa)</a> 
<a href="https://www.dco.uscg.mil/Portals/9/NMC/pdfs/professional_qualifications/crediting_sea_service.pdf>Definition of a "day"</a>
</p>

<p>If you have any questions or concerns about this course, please e-mail me at ross@captainsschool.com or call me at (910) 547-3689.<br />
 <br />
Thank You,<br />
Ross Fowle, BMCM, USCG (ret)<br />
3Bs Captains School</p>
`;
const registrationBodyText = `This course begins on {date} Attendance at all classes is mandatory to receive a certificate.

Your instructor for this course is {captain}. The class will be held at {classroom_location}. 

I have included links the Coast Guard checklist and required license application forms. You are not required to have these complete prior to class, but it is a good idea to get a head start on the application process.

If you have any questions or concerns about this course, please e-mail me at ross@captainsschool.com or call me at (910) 547-3689.
 
Thank You,
Ross Fowle, BMCM, USCG (ret)
3Bs Captains School`;

module.exports = {
  balancePaymentBody,
  balancePaymentSubject,
  cashPaySubject,
  cashPayBodyHTML,
  cashPayBodyText,
  registrationSubject,
  registrationBodyText,
  registrationBodyHTML,
  balanceDueSubject,
  balanceDueBodyHTML,
  balanceDueBodyText,
};
