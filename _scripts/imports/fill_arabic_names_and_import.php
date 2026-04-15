<?php
/**
 * FILL ARABIC NAMES + IMPORT ALL EMPLOYEES
 * Run: php _scripts/imports/fill_arabic_names_and_import.php
 */

require __DIR__.'/../../vendor/autoload.php';
$app = require_once __DIR__.'/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Noble\Hrm\Models\Employee;
use Carbon\Carbon;

echo "=================================================\n";
echo "🚀 NOBLE EMPLOYEES — FILL ARABIC NAMES + IMPORT\n";
echo "=================================================\n\n";

// ─── Arabic Name Mapping for ALL missing entries ───
$arabicNames = [
    'ABDUSAMAD MUKKIL AHAMED KUTTY' => 'عبد الصمد مكيل أحمد كتي',
    'NOOR YASSIN' => 'نور ياسين',
    'SEID YASSIN  AHMED' => 'سعيد ياسين أحمد',
    'MD SAGAR  HOSSAIN' => 'صاغر حسين',
    'AHMED HAMDY AL-SAYED SABEE' => 'أحمد حمدي السيد صبيع',
    'ANAS MAHMOUD AL-AYOUBI' => 'أنس محمود الأيوبي',
    '_SHERIN ZADA UMAR ZADA KHAN' => 'شيرين زادا عمر زادا خان',
    'ALS-HAHAT AL-MOHAMMADI ABU AL-HAYTHAM FISHAR' => 'الشحات المحمدي أبو الهيثم فيشار',
    'MOUKHTAR SEIF' => 'مختار سيف',
    'SHAKIR  HUSAIN HANEEF' => 'شاكر حسين حنيف',
    'AHMED ABDULLAH MUSLEH AL-MANZLAWY' => 'أحمد عبدالله مصلح المنزلاوي',
    'HAFEEZ ULLAH SHEHZAD KHAN' => 'حفيظ الله شهزاد خان',
    'HAZRAT ALI  FARAMOZ' => 'حضرت علي فراموز',
    'JAHANGIR KHAN REDI GUL' => 'جهانگير خان ردي گل',
    'MUHAMMAD ALAM MUHAMMAD GUL' => 'محمد عالم محمد گل',
    'GHULAM SARWAR ABDUL GHANI' => 'غلام سرور عبد الغني',
    'IHAB AHMAD ABDUL AL' => 'إيهاب أحمد عبد العال',
    'RAFEEKALI   YASEEN' => 'رفيق علي ياسين',
    'ARSHAD ALI AQAL ZADA' => 'أرشد علي عقال زادا',
    'RAHATH   IMTIAZ' => 'رحت إمتياز',
    'JAN FEROZE ASEEM KHAN' => 'جان فيروز عاصم خان',
    'GHULAM MUSTAFA - ABDUL MAJEED' => 'غلام مصطفى عبد المجيد',
    'FAZAL HAYAT - SAZBAR' => 'فضل حياة سازبار',
    'IKRAM ULLAH FAZAL KARIM' => 'إكرام الله فضل كريم',
    'SARIF MIAH FARUK MIA' => 'شريف ميا فاروق ميا',
    'SANAULLAH   MIAH' => 'ثناء الله ميا',
    'MUHAMMAD FARHAN MALIK ZAFAR SAJJAD' => 'محمد فرحان مالك ظفر سجاد',
    'MUHAMMAD NASIR MUHAMMAD HUSSAIN' => 'محمد ناصر محمد حسين',
    'RIZQ GHAZI MOHAMMED GHAZI' => 'رزق غازي محمد غازي',
    'MAKHMOOD AHMED MUHAMMAD YAQOOB' => 'محمود أحمد محمد يعقوب',
    'WAJID KHAN ABDUL SAMAD' => 'واجد خان عبد الصمد',
    'MUHAMMAD ZAKWAN FAROOQ' => 'محمد ذكوان فاروق',
    'ARSALAN ARIF' => 'أرسلان عارف',
    'MUHAMMAD SAFDAR' => 'محمد صفدر',
    'ANWAR SHAH MIAN SAYED RAHMAN' => 'أنور شاه ميان سيد الرحمن',
    'NAGAH FATHY ELGEADI ABDO' => 'نجاح فتحي الجعيدي عبده',
    'ASGHAR SHAH MUHAMMAD SHAH' => 'أصغر شاه محمد شاه',
    'JOHIR MD FORID UDDIN' => 'جوهر فريد الدين',
    'SHARMA SANTOSH - KUMAR' => 'شارما سانتوش كومار',
    'ABDUL NAZER  PALAKUNDAN' => 'عبد الناصر بالاكوندان',
    'MUHAMMAD REHMAN QASIM JAN' => 'محمد رحمان قاسم جان',
    'MOHAMAD IBRAHIM ABOUDAHWA' => 'محمد إبراهيم أبو دهوة',
    'FAZAL AHAD  QAMAR' => 'فضل أحد قمر',
    'ZAFAR ALI  RASOOL MUHAMMAD' => 'ظفر علي رسول محمد',
    'ALSAYED ELDASOUKI QASIM AWAIDA' => 'السيد الدسوقي قاسم عويضه',
    'MUHAMMAD FAYYAZ MUHAMMAD NAZIR' => 'محمد فياض محمد ناظر',
    'BASSAM ABDELENABY ABOUELRISH' => 'بسام عبد النبي أبو الريش',
    'MUHAMMAD ISMAIL REHMANI GUL' => 'محمد إسماعيل رحماني گل',
    'AHMED YOUNES ABDEL QADER AL-TARINI' => 'أحمد يونس عبد القادر الطريني',
    'AHMAT HISSENE ABDALLAH NGARE' => 'أحمد حسين عبدالله نقاري',
    'DIEGO VILLALUNA HERRERA' => 'دييغو فيالونا هيريرا',
    'FARMAN ALI FAZAL WADOOD KHAN' => 'فرمان علي فضل ودود خان',
    'IFTIKHAR ALI JEHAN ZEB' => 'افتخار علي جهان زيب',
    'KHAN WAQAS' => 'خان وقاص',
    'SHAHAB UD DIN  SHAMSHAD KHAN' => 'شهاب الدين شمشاد خان',
    'RAFIQ KHAN RASOOL MUHAMMAD' => 'رفيق خان رسول محمد',
    'ASLAM BAHADAR SHAH' => 'أسلم بهادر شاه',
    'SAEED AHMED MANZOOR UL HAQ' => 'سعيد أحمد منظور الحق',
    'IHSAN ULLAH HABIB ULLAH' => 'إحسان الله حبيب الله',
    'YAR MUHAMMAD BAHADAR SHAH' => 'يار محمد بهادر شاه',
    'MOHAMED AHMED WLHADY SALEM' => 'محمد أحمد الهادي سالم',
    'WASOAT KHAN DOST MOUHAMMAD' => 'وسعت خان دوست محمد',
    'TARIQ AZIZ AMIR AFZAL KAHN' => 'طارق عزيز أمير أفضل خان',
    'SAIF ULLAH DAR' => 'سيف الله دار',
    'ABDUL AZIZ FAZAL RAZIQ' => 'عبد العزيز فضل رزيق',
    'DANIYAL AHMAD MUSHTAQ HUSAIN' => 'دانيال أحمد مشتاق حسين',
    'DAWOOD KHAN JEHAN ZEB' => 'داوود خان جهان زيب',
    'YOSOUF MAHAMAR ABDULLAH ABKAR' => 'يوسف محمر عبدالله أبكر',
    'AHMAD YASSEN' => 'أحمد ياسين',
    'NOT EXIST' => '', // Skip placeholder rows
    'ABDULLAH MUHAMMAD  AFZAL' => 'عبدالله محمد أفضل',
    'FURAKAN KHALIL  AHAMAD' => 'فركان خليل أحمد',
    'MUZAFAR KHAN KARIM KHAN' => 'مظفر خان كريم خان',
    'ANWAR ALI - MUSTAJAB' => 'أنور علي مستجاب',
    'AHMED BASHER RAHMAN GUL' => 'أحمد باشر رحمان گل',
    'MOHAMMAD KHAN RAHMAN GUL' => 'محمد خان رحمان گل',
    'ELSAYED SAAD ABORAYA ABOUADARA' => 'السيد سعد أبو ريه أبو عذرة',
    'KHALID HISIN ABDALLA ABKER' => 'خالد حسين عبدالله أبكر',
    'MUHAMMAD ABDULLAH FARID GUL' => 'محمد عبدالله فريد گل',
    'ABBAS MOHAMED ABBAS KANDIL' => 'عباس محمد عباس قنديل',
    'SARDAR SHAH MOHAMMAD SHAH' => 'سردار شاه محمد شاه',
    'HAIDAR ALI MAIDAR KHAN' => 'حيدر علي ميدر خان',
    'SEHAT GUL RAHAT GUL' => 'صحت گل راحت گل',
    'FEROZ KHAN - MALANG' => 'فيروز خان ملنگ',
    'AHMED MOHAMED ELGENDI' => 'أحمد محمد الجندي',
    'HAMID ALI SHAKEEL AHMAD' => 'حامد علي شكيل أحمد',
    'DILDAR AHMAD MUHAMMAD SHER' => 'دلدار أحمد محمد شير',
    'NAEEM KHAN HAMESH GUL' => 'نعيم خان حميش گل',
    'IBRAHIM TAHA ABOU ELBELYALY' => 'إبراهيم طه أبو البليلي',
    'ELSAYED ABDLHAMID MOHAMED ELMINTAWI' => 'السيد عبد الحميد محمد المنتوي',
    'MOHAMMAD IRSHAD  ALAM' => 'محمد إرشاد عالم',
    'MOHAMMED ISRAFIL REHAJ UDDIN' => 'محمد إسرافيل رحج الدين',
    'AHMED MOHAMED ELASHRY' => 'أحمد محمد العشري',
    'ASHRAF IBRAHIM MASSARA' => 'أشرف إبراهيم مسارة',
    'MOHMMED ARFAT RAHMAN' => 'محمد عرفات رحمان',
    'SIKNDER   ALI' => 'سكندر علي',
    'ADIL HUSSAIN' => 'عادل حسين',
    'MD MOMNIR HOSSAIN' => 'منير حسين',
    'INTEZAR ALI ABDUL GHAFOOR' => 'إنتظار علي عبد الغفور',
    'MD JAKARIA   HASAN' => 'ذكريا حسن',
    'MAHMOUD REZK MAHMOUD ELMOSSELHI' => 'محمود رزق محمود المسلحي',
    'ASHOK  KUMAR RAMJEET PRASAD YADAV' => 'أشوك كومار رامجيت براساد يادف',
    'IKHTIAR UDDIN  ISLAM UDDIN' => 'اختيار الدين إسلام الدين',
    'RENE DINGLASAN  CRUZ' => 'ريني دينغلاسان كروز',
    'SANJAY   BIND' => 'سانجاي بيند',
    'YASIR ALI ABBAS KHAN' => 'ياسر علي عباس خان',
    'WASEEM SAJJAD FAZAL RABI' => 'وسيم سجاد فضل ربيع',
    'SHAKEEL AHMAD' => 'شكيل أحمد',
    'SOUFIANCE DAKIR' => 'سفيان داكر',
    'MUHAMMAD ZUBAIR RAJMALI KHAN' => 'محمد زبير راجمالي خان',
    'MOHAMMAD ABDULLAH MUHAMMAD HANIF' => 'محمد عبدالله محمد حنيف',
    'MD SHAKHAWAT HOSSAIN' => 'شاخوات حسين',
    'BALAWAL BASHIR' => 'بلاول بشير',
    'HAMEED ULLAH' => 'حميد الله',
    'SHAYAN AZEEM KHAN' => 'شايان عظيم خان',
];

// ─── Read and update CSV ───
$csvPath = __DIR__ . '/../../docs/Archive/nobel Employee S Data.csv';

if (!file_exists($csvPath)) {
    die("❌ CSV not found: {$csvPath}\n");
}

$file = fopen($csvPath, 'r');
$headers = fgetcsv($file);
$nameCol = array_search('Name', $headers);
$nameArCol = array_search('Name (Ar)', $headers);
$rows = [];
$updatedArNames = 0;

while (($row = fgetcsv($file)) !== false) {
    $englishName = trim($row[$nameCol] ?? '');
    $currentAr = trim($row[$nameArCol] ?? '');
    
    if (empty($currentAr) && isset($arabicNames[$englishName]) && !empty($arabicNames[$englishName])) {
        $row[$nameArCol] = $arabicNames[$englishName];
        $updatedArNames++;
    }
    $rows[] = $row;
}
fclose($file);

// ─── Write updated CSV back ───
$file = fopen($csvPath, 'w');
// Write BOM for proper UTF-8 in Excel
fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
fputcsv($file, $headers);
foreach ($rows as $row) {
    fputcsv($file, $row);
}
fclose($file);
echo "📝 Updated {$updatedArNames} Arabic names in CSV\n\n";

// ─── Now import all employees ───
echo "═══════════════════════════════════════════════════\n";
echo "📥 IMPORTING EMPLOYEES TO DATABASE...\n";
echo "═══════════════════════════════════════════════════\n\n";

$companyUser = User::where('type', 'company')->first();
if (!$companyUser) {
    echo "⚠️ No company user found. Creating Noble Architecture company account...\n";
    
    // Create superadmin first
    $superadmin = User::create([
        'name' => 'Super Admin',
        'email' => 'superadmin@noble.dion.sy',
        'password' => Hash::make('Noble@2026'),
        'type' => 'super admin',
        'lang' => 'ar',
    ]);
    
    // Create superadmin role
    $saRole = \Spatie\Permission\Models\Role::firstOrCreate(
        ['name' => 'superadmin', 'guard_name' => 'web'],
        ['label' => 'Super Admin', 'created_by' => $superadmin->id]
    );
    $superadmin->assignRole($saRole);
    echo "  ✅ Superadmin created (ID: {$superadmin->id})\n";
    
    // Create company user
    $companyUser = User::create([
        'name' => 'Noble Architecture',
        'email' => 'admin@noble.dion.sy',
        'password' => Hash::make('Noble@2026'),
        'type' => 'company',
        'lang' => 'ar',
        'active_plan' => 1,
        'plan_expire_date' => null, // Lifetime
        'created_by' => $superadmin->id,
    ]);
    
    // Create company role
    $companyRole = \Spatie\Permission\Models\Role::firstOrCreate(
        ['name' => 'company', 'guard_name' => 'web'],
        ['label' => 'Company', 'created_by' => $superadmin->id]
    );
    $companyUser->assignRole($companyRole);
    
    // Initialize company settings & roles
    User::CompanySetting($companyUser->id);
    User::MakeRole($companyUser->id);
    echo "  ✅ Company created (ID: {$companyUser->id})\n";
}

$companyId = $companyUser->id;
echo "🏢 Company ID: {$companyId} ({$companyUser->name})\n\n";

// Ensure staff role exists under this company
$staffRole = \Spatie\Permission\Models\Role::where('name', 'staff')
    ->where('created_by', $companyId)
    ->first();

if (!$staffRole) {
    User::MakeRole($companyId);
    echo "  ✅ Created staff/client/vendor roles for company\n\n";
}

$file = fopen($csvPath, 'r');
// Skip BOM if present
$bom = fread($file, 3);
if ($bom !== chr(0xEF).chr(0xBB).chr(0xBF)) {
    rewind($file);
}
$headers = fgetcsv($file);
$headerMap = array_flip($headers);

$successCount = 0;
$skippedCount = 0;
$errorCount = 0;

DB::beginTransaction();
try {
    while (($data = fgetcsv($file)) !== false) {
        if (empty(array_filter($data))) continue;
        
        $applicationId = trim($data[$headerMap['Application ID'] ?? 0] ?? '');
        $englishName = trim($data[$headerMap['Name'] ?? 1] ?? '');
        $arabicName = trim($data[$headerMap['Name (Ar)'] ?? 2] ?? '');
        
        // Skip invalid rows
        if (empty($englishName) || $englishName === 'NOT EXIST') {
            $skippedCount++;
            continue;
        }

        $finalName = $englishName;

        // ─── Create or find User ───
        $emailRaw = trim($data[$headerMap['Email Address'] ?? 14] ?? '');
        $workEmail = trim($data[$headerMap['Work Email'] ?? 15] ?? '');
        $email = (!empty($workEmail) && strtolower($workEmail) !== 'n/a') ? $workEmail :
                 ((!empty($emailRaw) && strtolower($emailRaw) !== 'n/a') ? $emailRaw : null);
        
        if (empty($email)) {
            $email = strtolower(preg_replace('/[^a-z0-9]+/', '.', strtolower($finalName))) . mt_rand(100, 999) . '@noble.local';
        }
        
        // Ensure unique email
        while (User::where('email', $email)->exists()) {
            $email = 'emp_' . Str::random(6) . '@noble.local';
        }

        $user = User::create([
            'name' => $finalName,
            'email' => $email,
            'password' => Hash::make('Noble@2026'),
            'type' => 'staff',
            'mobile_no' => trim($data[$headerMap['Mobile No.'] ?? 12] ?? ''),
            'lang' => 'ar',
            'created_by' => $companyId,
            'is_enable_login' => 0,
        ]);

        // Assign staff role
        $role = \Spatie\Permission\Models\Role::where('name', 'staff')
            ->where('created_by', $companyId)
            ->first();
        if ($role) {
            $user->assignRole($role);
        }

        // ─── Parse dates safely ───
        $dob = parseDateSafe(trim($data[$headerMap['Birthdate'] ?? 3] ?? ''));
        $doj = parseDateSafe(trim($data[$headerMap['Joining Date'] ?? 37] ?? ''));
        $gosiDate = parseDateSafe(trim($data[$headerMap['تاريخ الإلتحاق حسب التامينات'] ?? 38] ?? ''));

        // ─── Determine status ───
        $rawNote = strtoupper(trim($data[$headerMap['Note'] ?? 48] ?? ''));
        $rawPayment = strtoupper(trim($data[$headerMap['Payment Method'] ?? 53] ?? ''));
        $empStatus = 'Active';
        if (str_contains($rawNote, 'RESIGNED') || str_contains($rawPayment, 'RESIGNED')) $empStatus = 'RESIGNED';
        elseif (str_contains($rawNote, 'TERMINAT') || str_contains($rawPayment, 'TERMINATED')) $empStatus = 'TERMINATED';
        elseif (str_contains($rawNote, 'MOVED') || str_contains($rawPayment, 'MOVED')) $empStatus = 'MOVED';
        elseif (str_contains($rawNote, 'INACTIVE')) $empStatus = 'RESIGNED';

        // ─── Parse salary ───
        $salaryRaw = trim($data[$headerMap['Total Salary'] ?? 52] ?? '0');
        $salary = is_numeric(str_replace([',', ' '], '', $salaryRaw)) ? 
                  (float) str_replace([',', ' '], '', $salaryRaw) : 0;

        // ─── Get Employee ID ───
        $csvEmpId = trim($data[$headerMap['Employee  ID'] ?? 34] ?? '');
        $empId = (!empty($csvEmpId) && strtolower($csvEmpId) !== '#n/a') ? $csvEmpId : Employee::generateEmployeeId();

        // ─── Get Job Titles ───
        $jobTitle = trim($data[$headerMap['Job Title'] ?? 35] ?? '');
        $jobTitleAr = trim($data[$headerMap['JOP Title Arabic'] ?? 36] ?? '');
        if ($jobTitleAr === '#N/A' || strtolower($jobTitleAr) === 'n/a') $jobTitleAr = '';

        try {
            Employee::create([
                'user_id' => $user->id,
                'application_id' => $applicationId,
                'employee_id' => $empId,
                'name_ar' => $arabicName,
                'date_of_birth' => $dob,
                'nationality' => trim($data[$headerMap['Nationality'] ?? 4] ?? ''),
                'marital_status' => trim($data[$headerMap['Marital Status'] ?? 5] ?? ''),
                'place_of_birth' => trim($data[$headerMap['Place of Birth'] ?? 6] ?? ''),
                'gender' => trim($data[$headerMap['Gender'] ?? 7] ?? '') ?: 'Male',
                'religion' => trim($data[$headerMap['Religion'] ?? 9] ?? ''),
                'no_of_dependents' => is_numeric(trim($data[$headerMap['No. of Dependents'] ?? 10] ?? '')) ? (int) trim($data[$headerMap['No. of Dependents'] ?? 10] ?? '') : 0,
                'blood_type' => trim($data[$headerMap['Blood Type'] ?? 11] ?? ''),
                'mobile_no' => trim($data[$headerMap['Mobile No.'] ?? 12] ?? ''),
                'alternate_mobile_no' => trim($data[$headerMap['Alternate Mobile No.'] ?? 13] ?? ''),
                'email_address' => $emailRaw,
                'work_email' => $workEmail,
                'place_of_residence' => trim($data[$headerMap['Place of residence'] ?? 16] ?? ''),
                'resident_type' => trim($data[$headerMap['Resident Type'] ?? 18] ?? ''),
                'iqama_no' => trim($data[$headerMap['ID/Iqama No.'] ?? 19] ?? ''),
                'passport_no' => trim($data[$headerMap['Passport No.'] ?? 20] ?? ''),
                'employee_status' => $empStatus,
                'employer_number' => trim($data[$headerMap['Employer Number'] ?? 23] ?? ''),
                'occupation' => trim($data[$headerMap['Occupation'] ?? 24] ?? ''),
                'education_level' => trim($data[$headerMap['Education Level'] ?? 25] ?? ''),
                'university' => trim($data[$headerMap['University/Institution'] ?? 26] ?? ''),
                'major_field' => trim($data[$headerMap['Major / Field of Study'] ?? 27] ?? ''),
                'graduation_year' => is_numeric(trim($data[$headerMap['Graduation Year'] ?? 28] ?? '')) ? (int) trim($data[$headerMap['Graduation Year'] ?? 28] ?? '') : null,
                'total_experience_years' => is_numeric(trim($data[$headerMap['Total Years of Experience'] ?? 29] ?? '')) ? (int) trim($data[$headerMap['Total Years of Experience'] ?? 29] ?? '') : 0,
                'computer_skills' => trim($data[$headerMap['Computer Skills Level'] ?? 30] ?? ''),
                'english_level' => trim($data[$headerMap['English Level'] ?? 31] ?? ''),
                'arabic_level' => trim($data[$headerMap['Arabic Level'] ?? 32] ?? ''),
                'job_title' => $jobTitle,
                'job_title_ar' => $jobTitleAr,
                'date_of_joining' => $doj,
                'gosi_joining_date' => $gosiDate,
                'allocated_area' => trim($data[$headerMap['Allocated Area'] ?? 39] ?? ''),
                'employment_type' => trim($data[$headerMap['Employment Type'] ?? 41] ?? ''),
                'notes' => trim($data[$headerMap['Note'] ?? 48] ?? ''),
                'insurance_status' => trim($data[$headerMap['Insurance Status'] ?? 49] ?? ''),
                'insurance_class' => trim($data[$headerMap['Insurance Class'] ?? 50] ?? ''),
                'sponsor_id' => trim($data[$headerMap['Sponsor ID'] ?? 51] ?? ''),
                'basic_salary' => $salary,
                'payment_method' => trim($data[$headerMap['Payment Method'] ?? 53] ?? ''),
                'bank_name' => trim($data[$headerMap['Bank Name'] ?? 54] ?? ''),
                'account_holder_name' => trim($data[$headerMap['Account Holder Name'] ?? 55] ?? ''),
                'bank_iban' => trim($data[$headerMap['Bank IBAN No'] ?? 56] ?? ''),
                'swift_code' => trim($data[$headerMap['SWIFT Code'] ?? 57] ?? ''),
                'creator_id' => $companyId,
                'created_by' => $companyId,
            ]);
            
            $successCount++;
            echo "  ✅ [{$applicationId}] {$finalName}";
            if (!empty($arabicName)) echo " — {$arabicName}";
            echo " ({$empStatus})\n";
            
        } catch (\Exception $e) {
            $errorCount++;
            echo "  ❌ [{$applicationId}] {$finalName} — Error: " . $e->getMessage() . "\n";
        }
    }
    
    fclose($file);
    DB::commit();
    
    echo "\n═══════════════════════════════════════════════════\n";
    echo "📊 FINAL REPORT\n";
    echo "═══════════════════════════════════════════════════\n";
    echo "✅ Imported: {$successCount}\n";
    echo "⏭️  Skipped:  {$skippedCount}\n";
    echo "❌ Errors:   {$errorCount}\n";
    echo "📋 Total DB: " . Employee::count() . " employees\n";
    echo "👥 Total Users: " . User::where('type', 'staff')->count() . " staff users\n";
    echo "═══════════════════════════════════════════════════\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ FATAL ERROR: " . $e->getMessage() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
    echo "   File: " . $e->getFile() . "\n";
}

function parseDateSafe(string $val): ?string {
    $val = trim($val);
    if (empty($val) || strtolower($val) === 'n/a') return null;
    // Remove time component if present
    $val = preg_replace('/\s+\d{2}:\d{2}:\d{2}(\.\d+)?$/', '', $val);
    try {
        $date = Carbon::parse($val);
        if ($date->year < 1900 || $date->year > 2030) return null;
        return $date->format('Y-m-d');
    } catch (\Exception $e) {
        return null;
    }
}
