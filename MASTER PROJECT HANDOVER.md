# MASTER PROJECT HANDOVER

# SMART KKU PLATFORM (PWA)

## เอกสารสรุปแนวคิด ข้อกำหนดระบบ กติกาทางธุรกิจ และรายละเอียดการพัฒนา

Project Context & System Specification Handover

สถานะเอกสาร: Consolidated Project Brief  
ชื่อระบบหลัก: Smart KKU Platform  
รูปแบบระบบ: Progressive Web Application (PWA)  
แนวคิดด้านประสบการณ์บุคลากร: KKU HR Experience  
ฐานข้อมูลหลัก: PostgreSQL  
ระบบยืนยันตัวตน: KKU Account / KKU SSO  
โครงสร้างพื้นฐาน: Cloud Server ของมหาวิทยาลัยขอนแก่น

---

# PART 1: คำสั่งและบริบทสำหรับ AI MODEL ที่รับช่วงพัฒนาต่อ

## 1.1 วัตถุประสงค์ของเอกสาร

เอกสารฉบับนี้จัดทำขึ้นเพื่อส่งต่อข้อมูลโครงการ Smart KKU Platform ให้ AI Model หรือทีมพัฒนาซอฟต์แวร์รายอื่นสามารถดำเนินงานต่อได้อย่างต่อเนื่อง โดยไม่สูญเสียข้อกำหนดที่ได้ตกลงกันไว้ก่อนหน้านี้

AI Model ที่รับช่วงต้องอ่านเอกสารทั้งหมดก่อนเริ่มงาน และต้องรักษาข้อกำหนดต่อไปนี้:

1. ห้ามเปลี่ยนชื่อระบบหลักจาก Smart KKU Platform  
2. ห้ามเข้าใจว่า KKU HR Experience เป็นชื่อระบบหลัก โดย KKU HR Experience เป็นแนวคิดด้านประสบการณ์บุคลากรภายใน Smart KKU Platform  
3. ห้ามลดทอน KKU Healthy Life ให้เหลือเพียงระบบลงทะเบียนกิจกรรม เพราะเป็นหนึ่งในโมดูลหลักและเป็นจุดเด่นของแพลตฟอร์ม  
4. ห้ามรวม POINT, EXP และ QUALIFICATION ให้เป็นระบบคะแนนประเภทเดียวกัน  
5. ห้ามละเลยสูตรคำนวณคะแนน KKU Healthy Life  
6. ห้ามละเลยระบบตรวจสอบการออกกำลังกายและ Anti-Cheat  
7. ห้ามละเลยระบบ Referral Engine, Central Marketplace และ Dynamic QR Voucher  
8. ห้ามละเลยระบบใบประกาศ เกียรติบัตร และ Achievement Portfolio  
9. ห้ามออกแบบระบบโดยยึดเฉพาะกิจกรรมของกองทรัพยากรบุคคล เพราะแพลตฟอร์มต้องรองรับหลายหน่วยงาน  
10. ห้ามใช้ Google Sheets เป็นฐานข้อมูลหลัก เพราะกำหนดให้ใช้ PostgreSQL  
11. ห้ามให้ Frontend เชื่อมต่อ PostgreSQL โดยตรง  
12. ห้ามกำหนดสูตร เงื่อนไข หรือสิทธิ์ใหม่เองโดยไม่มีการระบุว่าเป็นข้อเสนอ  
13. หากพบข้อมูลขัดแย้งหรือข้อกำหนดที่ยังไม่ชัดเจน ต้องบันทึกเป็น Open Questions และถามผู้รับผิดชอบก่อนนำไปใช้จริง  
14. ต้องรักษาประวัติธุรกรรมและตรวจสอบย้อนหลังได้  
15. ต้องออกแบบระบบให้รองรับการขยายจำนวนบุคลากร กิจกรรม และหน่วยงานในอนาคต

---

# PART 2: ชื่อระบบ วิสัยทัศน์ และขอบเขต

## 2.1 ชื่อระบบ

Smart KKU Platform

เป็นชื่อระบบหลักอย่างเป็นทางการ ใช้ในเอกสาร TOR, System Blueprint, Database Design, API Specification, คู่มือ และการนำเสนอต่อผู้บริหาร

รูปแบบระบบ: Progressive Web Application (PWA)

## 2.2 KKU HR Experience

KKU HR Experience ไม่ใช่ชื่อระบบหลัก แต่เป็นแนวคิดการออกแบบประสบการณ์บุคลากรภายใน Smart KKU Platform

ครอบคลุมประสบการณ์ตั้งแต่:

* การเข้าร่วมโครงการและกิจกรรม  
* การพัฒนาสุขภาพกายและสุขภาพจิต  
* การพัฒนาความรู้และทักษะ  
* การสะสม POINT และ EXP  
* การได้รับ Qualification  
* การสร้างกลุ่มและชุมชน  
* การแลกรางวัลและใช้สิทธิประโยชน์  
* การได้รับใบประกาศและเกียรติบัตร  
* การเก็บประวัติความสำเร็จและประสบการณ์ส่วนบุคคล  
* การสร้างความสัมพันธ์ระหว่างบุคลากรและหน่วยงาน

## 2.3 วิสัยทัศน์

Smart KKU Platform เป็นแพลตฟอร์มกลางที่เชื่อมโยงบุคลากร หน่วยงาน โครงการ กิจกรรม การพัฒนาตนเอง สุขภาพ ชุมชน และสิทธิประโยชน์ไว้ในระบบเดียว

แนวคิดการออกแบบ:

One Platform · Multiple Organizations · Multiple Projects · Configurable Activities

หมายถึง:

* มีแพลตฟอร์มกลางเพียงระบบเดียว  
* บุคลากรทุกหน่วยงานสามารถใช้งานร่วมกัน  
* แต่ละหน่วยงานสามารถจัดทำโครงการและกิจกรรมของตนเอง  
* แต่ละกิจกรรมกำหนดกติกาและรูปแบบการดำเนินงานได้  
* มีระบบกลางสำหรับ POINT, EXP, Qualification, Rewards และ Achievement  
* สามารถเพิ่มโครงการหรือประเภทกิจกรรมใหม่โดยไม่ต้องรื้อโครงสร้างระบบหลัก

## 2.4 ผู้ใช้งานเป้าหมาย

บุคลากรมหาวิทยาลัยขอนแก่นทุกหน่วยงาน โดยใช้ KKU Account / KKU SSO เป็นช่องทางเข้าสู่ระบบ

หน่วยงานที่สามารถใช้ระบบ ได้แก่:

* กองทรัพยากรบุคคล  
* คณะต่าง ๆ  
* สำนัก  
* ศูนย์  
* หน่วยงานสนับสนุน  
* หน่วยงานอื่นภายในมหาวิทยาลัย

กองทรัพยากรบุคคลเป็นหน่วยงานหลักในการกำกับดูแลแพลตฟอร์ม แต่ไม่ได้หมายความว่าทุกกิจกรรมต้องเป็นกิจกรรมของกองทรัพยากรบุคคล

---

# PART 3: โครงสร้างสิทธิ์ผู้ใช้งาน (5-Tier RBAC & Dual-Role)

ระบบกำหนดกลุ่มสิทธิ์หลัก 5 ประเภท

## 3.1 User

บุคลากรทั่วไป สามารถ:

* เข้าร่วมกิจกรรมและโครงการ  
* ลงทะเบียนกิจกรรม  
* Check-in ผ่าน QR, GPS หรือวิธีที่กิจกรรมกำหนด  
* ส่งผลการออกกำลังกาย  
* Sync ข้อมูลสุขภาพ  
* ดูประวัติการเข้าร่วมกิจกรรม  
* สะสม POINT  
* สะสม EXP  
* รับ Qualification  
* ตรวจสอบระดับของตนเอง  
* แลกรางวัล  
* สร้างกลุ่มเมื่อมีคุณสมบัติตามเงื่อนไข  
* เข้าร่วมกลุ่มหลายกลุ่มตามข้อจำกัด  
* สร้างโพสต์และแสดงความคิดเห็น  
* เชิญเพื่อนเข้าร่วมกิจกรรม  
* ดูใบประกาศและเกียรติบัตร  
* ดูสถิติรายปี  
* ดู Achievement Portfolio

## 3.2 Staff (Dual-Role)

Staff คือบุคลากรที่ได้รับมอบหมายให้ช่วยดูแลกิจกรรมหรือโครงการ

ความสามารถในโหมด Staff:

* สแกน QR Ticket ของผู้เข้าร่วม  
* ตรวจสอบการลงทะเบียน  
* Check-in ผู้เข้าร่วม  
* เปิดหรือแสดง Passcode สำหรับกิจกรรม  
* ตรวจสอบสถานะการเข้าร่วม  
* ดูรายชื่อผู้ลงทะเบียนตามสิทธิ์ที่ได้รับ  
* ปฏิบัติงานเฉพาะโครงการหรือกิจกรรมที่ได้รับมอบหมาย

Dual-Role Switcher

บุคลากรที่เป็น Staff ยังสามารถเป็นผู้เข้าร่วมกิจกรรมได้ด้วย

ต้องมีระบบสลับโหมด:

* Staff Mode: ทำหน้าที่ Staff  
* User Mode: ใช้งานในฐานะผู้เข้าร่วมกิจกรรม

ตัวอย่าง: Staff ที่กำลังสแกน QR ให้ผู้เข้าร่วม สามารถสลับไปโหมด User เพื่อส่งผลการออกกำลังกายหรือรับคะแนนของตนเองได้

การสลับโหมดต้องไม่ทำให้สิทธิ์ Staff สูญหาย และต้องตรวจสอบสิทธิ์ทุกครั้งจาก Backend

## 3.3 Department Admin

ผู้ดูแลระบบระดับหน่วยงาน

ความสามารถ:

* สร้างโครงการของหน่วยงาน  
* สร้างกิจกรรมและแคมเปญย่อย  
* กำหนด Staff  
* กำหนดผู้รับผิดชอบกิจกรรม  
* กำหนดจำนวนผู้เข้าร่วม  
* กำหนดวิธีลงทะเบียนและ Check-in  
* ดูรายชื่อผู้เข้าร่วม  
* ตรวจสอบสถานะการเข้าร่วม  
* ดูรายงานการมีส่วนร่วมของหน่วยงาน  
* ส่งออกรายงาน  
* จัดการกิจกรรมเฉพาะขอบเขตของหน่วยงานตนเอง

Department Admin ต้องไม่สามารถจัดการข้อมูลหรือกิจกรรมของหน่วยงานอื่นได้ เว้นแต่ได้รับสิทธิ์เพิ่มเติมจาก Super Admin

## 3.4 Super Admin (HR มข.)

ผู้ดูแลระบบระดับสูงของแพลตฟอร์ม โดยมีทีมงานจากกองทรัพยากรบุคคลเป็นผู้บริหารจัดการระบบ

ความสามารถ:

* จัดการหน่วยงานทั้งหมด  
* จัดการผู้ใช้งานและบทบาท  
* แต่งตั้ง Staff  
* กำหนดสิทธิ์ Admin  
* จัดการโครงการและกิจกรรมทั้งหมด  
* กำหนดสูตรคำนวณคะแนนกลาง  
* กำหนด Sport Factor  
* กำหนด Special Event Multiplier  
* กำหนด Duration Multiplier  
* จัดการ Referral Engine  
* กำหนดแต้มโบนัส  
* กำหนดเพดานการเชิญเพื่อน  
* จัดการ Central Marketplace  
* จัดการคลังของรางวัลส่วนกลาง  
* กำหนด Qualification Rules  
* กำหนด EXP Levels  
* กำหนดจำนวนกลุ่มสูงสุด  
* กำหนด Cooldown  
* ดูรายงานระดับมหาวิทยาลัย  
* ดู Audit Logs  
* จัดการการตั้งค่าระบบ

## 3.5 Merchant

ร้านค้าหรือร้านค้าพันธมิตรที่เข้าร่วมระบบแลกรางวัล

ความสามารถ:

* เข้าสู่ Merchant Interface  
* สแกน Dynamic QR Voucher  
* ตรวจสอบความถูกต้องของ Voucher  
* ตรวจสอบเวลาหมดอายุ  
* ยืนยันการใช้สิทธิ์  
* ดูประวัติ Voucher ที่ตนเองรับผิดชอบ

Merchant ต้องไม่สามารถเข้าถึงข้อมูลส่วนบุคคลหรือ POINT ของบุคลากรโดยไม่จำเป็น

## 3.6 ข้อกำหนด RBAC

* ใช้ Role-Based Access Control  
* ต้องมีการตรวจสอบสิทธิ์ที่ Backend ทุกครั้ง  
* Staff ได้รับมอบหมายเป็นรายโครงการหรือรายกิจกรรมได้  
* Department Admin เห็นข้อมูลตามหน่วยงาน  
* Super Admin มีสิทธิ์จัดการระดับแพลตฟอร์ม  
* Merchant เห็นเฉพาะข้อมูลการใช้ Voucher ของตน  
* ต้องมี Audit Log สำหรับการดำเนินการสำคัญ  
* Dual-Role ต้องแยกการแสดงผลของ User Mode และ Staff Mode โดยไม่ถือว่าการซ่อนปุ่มใน Frontend เป็นการรักษาความปลอดภัย

---

# PART 4: KKU HEALTHY LIFE ENGINE

## 4.1 ความสำคัญ

KKU Healthy Life เป็นหนึ่งในโมดูลหลักและเป็นจุดเด่นของ Smart KKU Platform

ไม่ใช่เพียงกิจกรรมทั่วไป แต่เป็นระบบส่งเสริมสุขภาพและ Gamification ที่มีระบบคำนวณคะแนนการออกกำลังกายโดยเฉพาะ

ระบบเดิมมีแนวคิดการส่งผลการออกกำลังกายและคำนวณคะแนนจาก Calories และระยะเวลา โดยต้องนำสูตรที่กำหนดมาใช้เป็น Scoring Engine ของแพลตฟอร์ม

## 4.2 สูตรคำนวณคะแนนที่กำหนด

สูตรคำนวณคะแนนกลาง:

Points \= (Calories / Duration (sec)) × Sport Factor × Special Event × Duration Multiplier (%) × 100

คำอธิบาย:

* Calories: จำนวนแคลอรี่ที่เผาผลาญจากกิจกรรม  
* Duration (sec): ระยะเวลาออกกำลังกายในหน่วยวินาที  
* Sport Factor: ตัวคูณประเภทกีฬา  
* Special Event: ตัวคูณพิเศษของกิจกรรมหรือแคมเปญ  
* Duration Multiplier (%): ตัวคูณตามระยะเวลาที่ออกกำลังกาย  
* 100: ตัวคูณฐานตามสูตรที่กำหนด

ต้องรักษาสูตรนี้ไว้ ห้ามเปลี่ยนเป็น Calories ÷ Minutes หรือใช้สูตรอื่นแทนโดยพลการ

### ตัวอย่างประเภทกีฬาและ Sport Factor

| ประเภทกีฬา | Sport Factor |
| ----- | ----- |
| วิ่ง (Running) | 1.0 |
| เดิน (Walking) | 0.8 |
| ปั่นจักรยาน (Cycling) | 0.7 |
| แอโรบิก (Aerobic) | 0.9 |

ระบบต้องสามารถเพิ่มประเภทกีฬาและกำหนด Factor ใหม่ได้ในอนาคต

## 4.3 Auto-Sync และ Sport Mapping

ระบบต้องรองรับการนำเข้าข้อมูลการออกกำลังกายจากแหล่งข้อมูล เช่น:

* Strava  
* Garmin  
* Smartwatch  
* แอปพลิเคชันสุขภาพที่สามารถเชื่อมต่อได้

ความสามารถ:

* ซิงก์ข้อมูลการออกกำลังกาย  
* ดึงประเภทกีฬา  
* ดึง Calories  
* ดึง Duration  
* ดึงวันที่และเวลา  
* ดึงระยะทาง หากแหล่งข้อมูลมี  
* ดึงข้อมูล GPS หากแหล่งข้อมูลอนุญาต  
* Map ประเภทกีฬาไปยัง Sport Factor โดยอัตโนมัติ

ผู้ใช้งานสามารถเลือกประเภทกีฬาเองได้ แต่ระบบต้องตรวจสอบความสมเหตุสมผลของข้อมูลก่อนคำนวณคะแนน

การเชื่อมต่อแต่ละ Provider ต้องตรวจสอบ API, OAuth, Permission และข้อจำกัดของผู้ให้บริการก่อนพัฒนาจริง

## 4.4 Anti-Cheat Validation

ระบบต้องตรวจสอบความผิดปกติของข้อมูลการออกกำลังกาย

ตัวอย่างกติกาที่กำหนดไว้:

หากผู้ใช้เลือกประเภทกีฬาเป็น Running แต่ Pace ช้ากว่า 12 นาทีต่อกิโลเมตร (\>12 min/km) ระบบจะปรับ Sport Factor เป็น Walking เท่ากับ 0.8 โดยอัตโนมัติ

ตัวอย่าง:

* ผู้ใช้เลือก Running  
* ระบบตรวจสอบ Pace  
* Pace มากกว่า 12 min/km  
* ระบบเปลี่ยน Sport Factor เป็น 0.8  
* คำนวณคะแนนด้วย Factor ของ Walking

ระบบควรบันทึก:

* ประเภทกีฬาที่ผู้ใช้เลือก  
* ประเภทกีฬาที่ระบบประเมิน  
* Sport Factor เดิม  
* Sport Factor ที่ใช้จริง  
* เหตุผลการปรับ  
* วันที่ตรวจสอบ  
* สถานะการตรวจสอบ

ต้องไม่แก้ไขข้อมูลต้นฉบับโดยไม่มีประวัติ

ข้อกำหนดนี้เป็นกติกาตัวอย่างที่ผู้ใช้ระบุไว้ ไม่ควรขยายความหมายไปเป็นการปฏิเสธข้อมูลทั้งหมดโดยอัตโนมัติ

## 4.5 Workout Submission

บุคลากรสามารถส่งผลการออกกำลังกายผ่านระบบ

ข้อมูลที่ควรจัดเก็บ:

* ผู้ใช้งาน  
* ประเภทกีฬา  
* Calories  
* Duration  
* Distance (ถ้ามี)  
* Pace (ถ้ามี)  
* วันที่และเวลา  
* แหล่งที่มาของข้อมูล  
* Provider Activity ID  
* ข้อมูล GPS หรือข้อมูลอ้างอิงที่ได้รับอนุญาต  
* หลักฐานประกอบ  
* สถานะการตรวจสอบ  
* คะแนนที่คำนวณได้  
* เวอร์ชันสูตรที่ใช้  
* สถานะการอนุมัติ

ต้องป้องกันการส่งข้อมูล Activity เดิมซ้ำจาก Provider เดียวกัน

## 4.6 Scoring Engine

Scoring Engine ต้องทำงานเป็นระบบกลาง ไม่ควรฝังสูตรไว้ใน Frontend

Super Admin สามารถกำหนด:

* Sport Factor  
* Special Event Multiplier  
* Duration Multiplier  
* เงื่อนไขของกิจกรรม  
* วันเริ่มต้นและสิ้นสุดของสูตร  
* สถานะเปิดใช้งาน  
* เวอร์ชันสูตร

ต้องจัดเก็บ Formula Version ในแต่ละรายการคำนวณ เพื่อให้ตรวจสอบย้อนหลังได้

## 4.7 ความสัมพันธ์กับ POINT และ EXP

คะแนนจาก KKU Healthy Life ต้องเชื่อมกับระบบ POINT กลางตามกติกาที่กำหนด

ต้องแยกข้อมูลดังนี้:

* Workout Score: ผลคะแนนที่คำนวณจากการออกกำลังกาย  
* POINT: แต้มที่ได้รับจริงในกระเป๋ากลาง  
* EXP: ประสบการณ์ที่ได้รับตามกติกา  
* Qualification: สิทธิ์ที่ได้รับจากการผ่านกิจกรรมหรือโครงการ

อย่าสันนิษฐานว่า Workout Score เท่ากับ EXP

รายละเอียดการแปลง Workout Score เป็น POINT/EXP และเงื่อนไขการอนุมัติยังต้องกำหนดให้ชัดใน Business Rules

## 4.8 Fitness Dashboard

บุคลากรควรสามารถดู:

* ประวัติการออกกำลังกาย  
* Calories รวม  
* Duration รวม  
* Distance รวม  
* คะแนนสะสม  
* POINT ที่ได้รับ  
* กิจกรรมที่ผ่านการตรวจสอบ  
* สถานะการอนุมัติ  
* สถิติรายวัน รายเดือน และรายปี  
* Leaderboard ตามกติกาของแต่ละ Season

## 4.9 Season Management

KKU Healthy Life ต้องรองรับการจัดกิจกรรมหลายรุ่นหรือหลาย Season เช่น KKU Healthy Life 7, KKU Healthy Life 8 และรุ่นต่อไป

แต่ละ Season สามารถกำหนด:

* ชื่อ Season  
* รายละเอียด  
* วันเริ่มต้น  
* วันสิ้นสุด  
* สูตรคำนวณ  
* Sport Factor  
* Special Event Multiplier  
* Duration Multiplier  
* กติกาการส่งผล  
* เงื่อนไขการตรวจสอบ  
* เป้าหมาย  
* รางวัล  
* Leaderboard  
* รายงาน

ข้อมูล Season เก่าต้องยังตรวจสอบย้อนหลังได้ และการเปลี่ยนสูตรใน Season ใหม่ต้องไม่เปลี่ยนคะแนนที่คำนวณไปแล้วใน Season เก่า

---

# PART 5: HR EVENTS & ACTIVITY MANAGEMENT

## 5.1 หลักการ

ระบบต้องรองรับโครงการและกิจกรรมจากหลายหน่วยงาน

ตัวอย่าง:

* กองทรัพยากรบุคคลจัดอบรมบุคลากร  
* คณะแพทยศาสตร์จัดกิจกรรมเต้นแอโรบิค  
* คณะสถาปัตยกรรมศาสตร์จัดกิจกรรมออกแบบพื้นที่ทำงาน  
* ศูนย์ศิลปวัฒนธรรมจัดกิจกรรมสงกรานต์  
* กิจกรรม KKU Healthy Life  
* โครงการพัฒนาอาจารย์ใหม่

## 5.2 โครงสร้าง Project / Activity / Session

ต้องแยก 3 ระดับ:

Project \= โครงการหลัก เช่น KKU Healthy Life 8

Activity \= กิจกรรมภายในโครงการ เช่น การออกกำลังกายหรือการอบรม

Session \= รอบหรือช่วงเวลาของกิจกรรม เช่น รอบเช้า รอบบ่าย หรือวันที่ 1 และวันที่ 2

หนึ่ง Project มีหลาย Activities และหนึ่ง Activity มีหลาย Sessions ได้

## 5.3 ตัวอย่างกิจกรรม

ตัวอย่างที่ต้องรองรับ:

1. คณะแพทยศาสตร์: เต้นแอโรบิค บุคลากรที่สนใจเข้าร่วมได้ ไม่จำกัดจำนวน กำหนด EXP 100  
2. คณะสถาปัตยกรรมศาสตร์: ออกแบบห้องทำงาน รับ 30 คน มีแต้มและใบประกาศ กำหนด EXP 30  
3. กองทรัพยากรบุคคล: อบรมเฉพาะบุคลากรสายสนับสนุน จำนวน 30 คน  
4. กองทรัพยากรบุคคล: โครงการอาจารย์ใหม่ เฉพาะสายวิชาการ จำนวน 50 คน และเมื่อผ่านจะปลดล็อกกิจกรรมอบรมสายวิชาการขั้นสูง  
5. ศูนย์ศิลปวัฒนธรรม: กิจกรรมสงกรานต์ที่บึงศรีฐาน บุคลากรเช็กอินเพื่อรับ EXP 150

ตัวอย่างเหล่านี้แสดงให้เห็นว่ากิจกรรมแต่ละประเภทมีเงื่อนไขแตกต่างกัน ระบบต้องปรับแต่งได้

## 5.4 การกำหนดคุณสมบัติและจำนวนผู้เข้าร่วม

ผู้สร้างกิจกรรมกำหนดได้:

* ประเภทบุคลากร  
* หน่วยงาน  
* สายวิชาการหรือสายสนับสนุน  
* Qualification ที่ต้องมี  
* EXP ขั้นต่ำ  
* จำนวนที่รับ  
* วันเริ่มและวันสิ้นสุดการลงทะเบียน  
* สถานะเปิดหรือปิดรับสมัคร  
* เงื่อนไขการผ่าน  
* POINT  
* EXP  
* Qualification  
* Certificate  
* หลักฐาน  
* วิธีตรวจสอบการเข้าร่วม

ระบบต้องแสดงสถานะให้ผู้ใช้เห็น เช่น:

* สมัครได้  
* ไม่ผ่านคุณสมบัติ  
* กิจกรรมเต็ม  
* ปิดรับสมัคร

การตรวจสอบ Eligibility ต้องเกิดขึ้นใน Backend ไม่ใช่พึ่งการซ่อนปุ่มใน Frontend

## 5.5 Capacity Control

รองรับการจำกัดจำนวนผู้เข้าร่วม:

* กำหนดจำนวน เช่น 30 หรือ 50 คน  
* มี Real-time Counter  
* กำหนดจำนวนเป็น 0 เพื่อเปิดรับแบบไม่จำกัดจำนวน

ต้องป้องกันการสมัครเกินจำนวนเมื่อมีผู้ใช้งานหลายคนสมัครพร้อมกัน

การสมัครต้องมี Transaction และ Database Constraint หรือกลไก Lock ที่เหมาะสม

## 5.6 รูปแบบ Check-in

ระบบรองรับ 3 รูปแบบหลัก:

### OPEN / DIRECT

ผู้เข้าร่วมสามารถเข้าร่วมกิจกรรมตามรูปแบบที่กำหนด โดยอาจลงทะเบียนและถือว่าผ่านกิจกรรมตามกติกาได้ทันที

ต้องกำหนดให้ชัดว่ากิจกรรมประเภทนี้ไม่ต้องมีการยืนยันการมาถึงหรือการเข้าร่วมจริงเพิ่มเติม

### GPS / GEO-FENCE

ตรวจสอบตำแหน่งของผู้เข้าร่วมในบริเวณกิจกรรม

ความสามารถ:

* กำหนดตำแหน่ง  
* กำหนดรัศมีพื้นที่  
* ตรวจสอบพิกัด  
* ตรวจสอบเวลา  
* บันทึกผล Check-in  
* ป้องกันการส่งข้อมูลซ้ำ

ต้องออกแบบให้รองรับกรณีผู้ใช้ไม่อนุญาต Location Permission และบันทึกเหตุผลเมื่อไม่สามารถตรวจสอบได้

### 2-STEP QR TICKET \+ PASSCODE

ขั้นตอน:

1. บุคลากรลงทะเบียนกิจกรรม  
2. ระบบออก QR Ticket เฉพาะบุคคล  
3. Staff สแกน QR Ticket หน้างาน  
4. Staff เปิดเผย Passcode หรือ PIN  
5. ผู้เข้าร่วมกรอก Passcode  
6. Backend ตรวจสอบเงื่อนไข  
7. ระบบยืนยันการเข้าร่วม  
8. ระบบให้ POINT/EXP/Qualification ตามกติกา

ต้องมี:

* QR Ticket เฉพาะบุคคล  
* Passcode มีช่วงเวลาหรืออายุการใช้งาน  
* ป้องกันการใช้ซ้ำ  
* ป้องกันการส่งข้อมูลซ้ำ  
* บันทึก Staff ที่ดำเนินการ  
* บันทึกเวลา  
* บันทึกผู้อนุมัติ  
* Audit Log

ข้อกำหนดเดิมยังระบุให้สามารถกำหนด PIN ระยะเวลาใช้งานและการเปลี่ยนรหัสระหว่างงานได้ โดยรายละเอียดการหมุนรหัสต้องกำหนดในระบบจริง

## 5.7 Staff Assignment

ผู้จัดโครงการสามารถกำหนด Staff ให้แต่ละกิจกรรมได้

Staff เห็นเฉพาะกิจกรรมที่ได้รับมอบหมาย

ต้องรองรับกรณี:

* หนึ่งกิจกรรมมี Staff หลายคน  
* หนึ่ง Staff ดูแลหลายกิจกรรม  
* Staff มีสิทธิ์เฉพาะ Check-in  
* Staff มีสิทธิ์เปิด Passcode  
* Staff มีสิทธิ์ดูรายชื่อ  
* Staff มีสิทธิ์อนุมัติบางรายการตามที่กำหนด

---

# PART 6: POINT, EXP และ QUALIFICATION

ระบบต้องแยกข้อมูลทั้ง 3 ประเภทอย่างเด็ดขาด

## 6.1 POINT

POINT คือแต้มสะสมในกระเป๋ากลางของบุคลากร

คุณสมบัติ:

* ใช้แลกรางวัล  
* ไม่แยกกระเป๋าตามโครงการ  
* สะสมจากกิจกรรมต่าง ๆ  
* สะสมจาก KKU Healthy Life ตามกติกาที่กำหนด  
* รับโบนัสจาก Referral Engine  
* ใช้แลกของรางวัลใน Central Marketplace  
* มีประวัติการได้รับและใช้แต้ม  
* มีประวัติการปรับแต้ม

ต้องมี Point Ledger และ Point Balance

การแลกรางวัลต้องไม่ทำให้ประวัติการได้รับ POINT หายไป

## 6.2 EXP

EXP คือค่าประสบการณ์ส่วนบุคคล

ใช้สำหรับ:

* เพิ่มระดับบุคลากร  
* แสดงความก้าวหน้าการมีส่วนร่วม  
* ปลดล็อกสิทธิ์บางประเภท  
* เป็นข้อมูลสำหรับคำนวณ Group Power  
* ใช้กำหนดเงื่อนไขการสร้างกลุ่มตามระดับที่กำหนด

EXP ไม่ใช่ POINT และไม่ใช่เงิน

EXP ไม่ถูกโอนให้กลุ่ม และไม่ถูกหักเมื่อออกจากกลุ่ม

ควรจัดเก็บเป็น EXP Ledger และ EXP Balance

หาก Admin ปรับลด EXP ต้องมีเหตุผลและ Audit Log

EXP ไม่ควรถูกนำไปใช้แทนคุณสมบัติทางตำแหน่งหรือสมรรถนะทางวิชาชีพโดยอัตโนมัติ

## 6.3 EXP Level

มีการกำหนดตัวอย่างระดับ EXP ไว้ก่อนหน้า:

| Level | ชื่อ | EXP |
| ----- | ----- | ----- |
| 1 | Beginner | 0–499 |
| 2 | Explorer | 500–999 |
| 3 | Active | 1,000–1,999 |
| 4 | Expert | 2,000–3,999 |
| 5 | Extra | 4,000–6,999 |
| 6 | Master | 7,000–9,999 |
| 7 | Legend | 10,000 ขึ้นไป |

ข้อควรระวัง: ข้อมูลล่าสุดของโครงการระบุ Level 5 Privilege ที่ 10,000 EXP ซึ่งไม่ตรงกับตารางระดับตัวอย่างข้างต้น

สำหรับการสร้างกลุ่ม ให้ถือข้อกำหนดล่าสุดว่า ต้องมี 10,000 EXP จึงจะปลดล็อกการสร้างกลุ่ม แต่ต้องกำหนดตาราง Level อย่างเป็นทางการใหม่ก่อนพัฒนา UI และ Eligibility Engine

ห้ามนำตัวเลข Level 5 จากตารางเดิมมาใช้แทน 10,000 EXP โดยไม่ถามผู้รับผิดชอบ

## 6.4 QUALIFICATION

Qualification คือคุณสมบัติหรือสิทธิ์ที่ได้รับจากการผ่านกิจกรรมหรือโครงการ

ตัวอย่าง:

* NEW\_STAFF\_TRAINING\_COMPLETED  
* KKU\_HEALTHY\_LIFE\_COMPLETED  
* ACADEMIC\_ADVANCED\_TRAINING  
* SPORTS\_ACTIVITY\_MEMBER  
* NEW\_YEAR\_LOTTERY\_ELIGIBLE

ตัวอย่างการทำงาน:

บุคลากรผ่านโครงการอบรมบุคลากรใหม่ ได้ Qualification NEW\_STAFF\_TRAINING\_COMPLETED

จากนั้นสามารถสมัครกิจกรรมอบรมขั้นสูงหรือได้รับสิทธิ์ลุ้นของรางวัลปีใหม่ตาม Eligibility Rules

Qualification ต้องมีข้อมูลที่มา:

* ผู้ได้รับ  
* Qualification Key  
* กิจกรรมต้นทาง  
* วันที่ได้รับ  
* ผู้อนุมัติ  
* วันหมดอายุ (ถ้ามี)  
* สถานะ  
* วันที่เพิกถอน (ถ้ามี)  
* เหตุผลการเพิกถอน

## 6.5 Activity Reward Configuration

กิจกรรมหนึ่งกิจกรรมสามารถให้สิทธิ์ได้หลายแบบ:

* POINT  
* EXP  
* QUALIFICATION  
* CERTIFICATE  
* OTHER BENEFITS

ผู้จัดกิจกรรมกำหนดได้ว่าจะให้รายการใดบ้าง

---

# PART 7: REWARD MANAGEMENT & CENTRAL MARKETPLACE

## 7.1 Central Marketplace

ระบบคลังของรางวัลส่วนกลาง รวมรางวัลจากหน่วยงานต่าง ๆ ไว้ในที่เดียว

บุคลากรสามารถดูรางวัลและแลกได้ตามสิทธิ์ของตนเอง

## 7.2 Eligibility Rules

รางวัลสามารถกำหนดเงื่อนไขได้ เช่น:

1. แลกได้เลย  
2. เฉพาะบุคลากรบางหน่วยงาน  
3. ต้องมี E-Badge หรือ Qualification  
4. ต้องมี POINT เพียงพอ  
5. ต้องมี EXP ขั้นต่ำ หากกำหนด  
6. ต้องผ่านกิจกรรมหรือโครงการที่ระบุ

ตัวอย่าง:

นาย ก. มี 1,500 POINT และเคยผ่าน KKU Healthy Life

สามารถแลกรางวัลทั่วไปและรางวัลกีฬาที่กำหนด Qualification KKU Healthy Life

นาย ข. มี 5,000 POINT แต่ไม่เคยผ่าน KKU Healthy Life

สามารถแลกรางวัลทั่วไปได้ แต่ไม่สามารถแลกรางวัลกีฬาที่กำหนด Qualification ดังกล่าว

## 7.3 Inventory Management

ต้องมี:

* รายการรางวัล  
* จำนวนคงเหลือ  
* หน่วยงานเจ้าของรางวัล  
* POINT ที่ต้องใช้  
* เงื่อนไขการแลก  
* ช่วงเวลาเปิดแลก  
* สถานะพร้อมแลก  
* ประวัติการแลก  
* ประวัติการปรับสต็อก  
* ผู้ดำเนินการ

การแลกรางวัลต้องใช้ Database Transaction และ Lock Inventory อย่างเหมาะสม เพื่อป้องกันการแลกเกินจำนวนและการใช้ POINT เกินยอดคงเหลือ

## 7.4 Dynamic QR Voucher

เมื่อบุคลากรแลกรางวัลหรือได้รับสิทธิ์ส่วนลดจากร้านค้าพันธมิตร ระบบสามารถสร้าง Dynamic QR Voucher

ข้อกำหนด:

* QR มีอายุ 5 นาทีตามที่กำหนด  
* มีเวลานับถอยหลัง  
* Merchant สแกน QR  
* Backend ตรวจสอบความถูกต้อง  
* ตรวจสอบวันหมดอายุ  
* ป้องกันการใช้ซ้ำ  
* เมื่อใช้สำเร็จให้เปลี่ยนสถานะ Voucher  
* บันทึกร้านค้าและเวลาที่ใช้สิทธิ์

QR ต้องไม่ใช่รหัสคงที่ที่นำภาพไปใช้ซ้ำได้

ควรใช้ Token ที่คาดเดายากและตรวจสอบสถานะจาก Backend ทุกครั้ง

---

# PART 8: REFERRAL ENGINE

## 8.1 วัตถุประสงค์

ระบบเชิญเพื่อนเข้าร่วมกิจกรรม เพื่อกระตุ้นการมีส่วนร่วมและสร้างเครือข่ายระหว่างบุคลากร

## 8.2 ขั้นตอนการทำงาน

1. บุคลากรเลือกกิจกรรมที่ต้องการเชิญเพื่อน  
2. ระบบสร้าง Unique Link หรือ QR Code  
3. ผู้เชิญส่งลิงก์ให้เพื่อน  
4. ผู้ถูกเชิญเปิดลิงก์  
5. ผู้ถูกเชิญสมัครกิจกรรม  
6. ผู้ถูกเชิญเข้าร่วมกิจกรรมสำเร็จ  
7. ระบบตรวจสอบเงื่อนไข Referral  
8. ระบบให้โบนัสแก่ผู้เชิญและผู้ถูกเชิญ

การให้โบนัสต้องเกิดเมื่อผู้ถูกเชิญเข้าร่วมกิจกรรมสำเร็จ ไม่ใช่เพียงเปิดลิงก์หรือสมัครแล้วโดยยังไม่ผ่านเงื่อนไข

## 8.3 Referral Bonus

ตัวอย่างการตั้งค่า:

* ผู้เชิญ \+100 POINT  
* ผู้ถูกเชิญ \+50 POINT  
* เชิญเพื่อนได้ไม่เกิน 5 คนต่อกิจกรรม  
* ตั้งตัวคูณพิเศษ เช่น ×2

ตัวเลขเหล่านี้เป็นตัวอย่างการตั้งค่า ไม่ใช่ค่าตายตัวของทุกกิจกรรม

## 8.4 Super Admin Control

Super Admin สามารถกำหนด:

* Bonus Inviter  
* Bonus Invitee  
* Referral Limit  
* Bonus Multiplier  
* ระยะเวลาแคมเปญ  
* เงื่อนไขการผ่าน  
* เงื่อนไขการให้โบนัส  
* สถานะเปิดหรือปิด Referral Engine

## 8.5 Anti-Abuse

ต้องป้องกัน:

* ผู้ใช้เชิญตัวเอง  
* การใช้ Referral ซ้ำ  
* การสมัครซ้ำด้วยบัญชีเดิม  
* การรับโบนัสหลายครั้งจากผู้ถูกเชิญคนเดียวกัน  
* การปลอมสถานะเข้าร่วมกิจกรรม  
* การสร้างบัญชีเพื่อรับโบนัสโดยไม่เป็นไปตามสิทธิ์

ต้องมี Referral Ledger และประวัติการให้โบนัส

---

# PART 9: COMMUNITY & CLUB MANAGEMENT

## 9.1 Social Community

บุคลากรสามารถ:

* ดูชุมชน  
* เข้าร่วมกลุ่ม  
* สร้างกลุ่มตามสิทธิ์  
* โพสต์ข้อความ  
* แสดงความคิดเห็น  
* แชร์กิจกรรม  
* เชิญสมาชิก  
* ดูสมาชิก  
* จัดกิจกรรมภายในกลุ่ม  
* ทำ Mini-Challenge

บุคลากรสามารถอยู่ในหลายกลุ่มได้พร้อมกัน

## 9.2 Level 5 Club Creation

ข้อกำหนดล่าสุด:

บุคลากรที่มี 10,000 EXP จะได้รับสิทธิ์ปลดล็อกปุ่ม:

\[ \+ สร้างกลุ่มออกกำลังกายใหม่ \]

ตัวอย่างชื่อกลุ่ม:

KKU Runners Club

สามารถสร้าง Mini-Challenge แข่งขันกันภายในกลุ่มได้

## 9.3 Group Limit

Platform Admin สามารถกำหนดจำนวนกลุ่มสูงสุดที่บุคลากรเข้าร่วมได้ เช่น 3 กลุ่มต่อคน

## 9.4 Cooldown

Platform Admin สามารถกำหนดระยะเวลารอหลังออกจากกลุ่ม เช่น 36 วัน

ตัวอย่าง:

* นายสรเป็นสมาชิก 3 กลุ่ม (3/3)  
* ออกจากกลุ่มวิ่งวิ่งวิ่ง  
* เหลือสมาชิก 2/3  
* ยังไม่สามารถเข้ากลุ่มเดินเดินได้จนกว่าจะครบ 36 วันจากวันที่ออกจากกลุ่ม

ตามตัวอย่างนี้ให้ตีความเป็น Global Cooldown หลังออกจากกลุ่มใด ๆ จนกว่าจะมีการยืนยันกติกาใหม่

ต้องเก็บ:

* วันเข้ากลุ่ม  
* วันออกจากกลุ่ม  
* กลุ่มต้นทาง  
* ผู้ดำเนินการ  
* เหตุผล  
* วันสิ้นสุด Cooldown

## 9.5 Group Power

Group Power \= ผลรวม EXP ปัจจุบันของสมาชิกที่ยังเป็นสมาชิกในกลุ่ม

ข้อกำหนด:

* EXP เป็นของบุคคล  
* ไม่โอน EXP ให้กลุ่ม  
* สมาชิกหนึ่งคนสามารถมีหลายกลุ่ม  
* EXP ของบุคคลหนึ่งคนถูกนำมาคำนวณในทุกกลุ่มที่เป็นสมาชิก  
* เมื่อสมาชิกออกจากกลุ่ม Group Power ลดลง  
* เมื่อเข้ากลุ่มใหม่ Group Power กลุ่มใหม่เพิ่มขึ้น  
* การออกจากกลุ่มไม่ลด EXP ส่วนบุคคล

ควรมี Group Power Snapshot เพื่อใช้ดูประวัติและจัดอันดับย้อนหลัง

ต้องป้องกัน Race Condition กรณีสมาชิกสมัครเข้าหลายกลุ่มพร้อมกันจนเกิน Group Limit

---

# PART 10: DIGITAL CERTIFICATE & ACHIEVEMENT

## 10.1 Digital Certificate

บุคลากรสามารถดูหรือใช้งานใบประกาศและเกียรติบัตรที่ได้รับจากกิจกรรมแต่ละกิจกรรมได้

ต้องเป็นโมดูลกลางที่เชื่อมกับทุกโครงการ ทุกหน่วยงาน และทุกกิจกรรม

## 10.2 ประเภทใบประกาศ

* ใบประกาศการเข้าร่วมกิจกรรม  
* ประกาศนียบัตรผ่านการอบรม  
* เกียรติบัตรรางวัลหรือความสำเร็จ

## 10.3 การกำหนดค่าโดยผู้จัดกิจกรรม

ผู้จัดกิจกรรมกำหนดได้:

* กิจกรรมมีใบประกาศหรือไม่  
* ใช้ Certificate Template ใด  
* ใครมีสิทธิ์ได้รับ  
* ต้องผ่านเงื่อนไขใด  
* ออกใบประกาศอัตโนมัติหรือให้ Staff อนุมัติ  
* วันออกใบประกาศ  
* ผู้ลงนาม  
* ข้อมูลบนใบประกาศ

## 10.4 การออกใบประกาศ

เมื่อบุคลากรผ่านเงื่อนไข:

1. ระบบตรวจสอบสถานะการผ่านกิจกรรม  
2. ตรวจสอบ Eligibility  
3. สร้าง Certificate ID  
4. สร้างไฟล์ PDF  
5. สร้าง QR Code สำหรับตรวจสอบ  
6. บันทึกข้อมูลในระบบ  
7. แสดงใน My Certificates

## 10.5 My Certificates

บุคลากรสามารถ:

* ดูใบประกาศทั้งหมด  
* ดาวน์โหลด PDF  
* เปิดดู  
* แชร์ลิงก์  
* ค้นหาตามปี  
* ค้นหาตามโครงการ  
* ค้นหาตามหน่วยงาน  
* ตรวจสอบสถานะ  
* ดูประวัติใบประกาศ

## 10.6 QR Verification

เมื่อบุคคลภายนอกสแกน QR:

ระบบแสดงเฉพาะข้อมูลที่จำเป็น เช่น:

* ชื่อผู้ได้รับ  
* เลขที่ใบประกาศ  
* ชื่อกิจกรรม  
* หน่วยงานผู้ออก  
* วันที่ออก  
* สถานะใบประกาศ

ต้องไม่เปิดเผยข้อมูลส่วนบุคคลเกินความจำเป็น

## 10.7 Immutable Certificate

ใบประกาศที่ออกแล้วต้องไม่เปลี่ยนแปลงตาม Template ใหม่

ต้องเก็บ:

* Certificate Snapshot  
* Template Version  
* ข้อมูล ณ วันที่ออก  
* ไฟล์ PDF  
* Certificate ID  
* วันออก  
* ผู้อนุมัติ

หากมีการเพิกถอนหรือออกใบใหม่ต้องเก็บประวัติและเหตุผล

สถานะที่ควรรองรับ:

* Issued  
* Revoked  
* Replaced

## 10.8 Personnel Achievement Portfolio

เป็นแฟ้มประวัติความสำเร็จของบุคลากร รวมข้อมูล:

* กิจกรรมที่เข้าร่วมในแต่ละปี  
* EXP และ Level  
* ใบประกาศและเกียรติบัตร  
* การอบรมและพัฒนาตนเอง  
* รางวัลและความสำเร็จ  
* ชั่วโมงการเข้าร่วมกิจกรรมที่ได้รับการรับรอง

---

# PART 11: ANNUAL STATISTICS

## 11.1 วัตถุประสงค์

บุคลากรต้องดูสถิติย้อนหลังรายปีได้ แม้ว่าจะนำ POINT ไปแลกรางวัลแล้วก็ตาม

## 11.2 ข้อมูลที่ต้องแสดง

1. Total Points Earned: POINT ที่ได้รับรวมในปีนั้น  
2. Peak Points Balance: ยอด POINT คงเหลือสูงสุดในปีนั้น  
3. Total EXP Earned: EXP ที่ได้รับรวมในปีนั้น  
4. Peak EXP: EXP สูงสุดในปีนั้น  
5. Annual Activity Participation: รายการกิจกรรมที่เข้าร่วมในปีนั้น

## 11.3 ข้อกำหนดการคำนวณ

* POINT Wallet เป็นกระเป๋ากลาง ไม่จำเป็นต้อง Reset ทุกปี  
* การแลกรางวัลไม่ทำให้ประวัติการได้รับ POINT หายไป  
* Peak Points Balance ต้องหมายถึงยอดคงเหลือสูงสุดในช่วงปีนั้น  
* EXP โดยปกติไม่ลด ยกเว้นการปรับหรือ Rollback ที่ได้รับอนุญาต  
* Annual EXP Peak ต้องสามารถคำนวณจาก Ledger หรือ Snapshot ได้  
* ใช้ Asia/Bangkok ในการแบ่งปี  
* ต้องสามารถตรวจสอบที่มาของสถิติได้

---

# PART 12: HR EVENTS ANALYTICS & REPORT EXPORT

## 12.1 Excel / CSV

ระบบส่งออกรายงานระดับกิจกรรมได้ เช่น:

* รายชื่อผู้สมัคร  
* รหัสบุคลากรตามสิทธิ์การเปิดเผย  
* หน่วยงาน  
* สถานะลงทะเบียน  
* สถานะ Check-in  
* สถานะผ่านกิจกรรม  
* วันที่เข้าร่วม  
* POINT ที่ได้รับ  
* EXP ที่ได้รับ  
* Qualification  
* สถานะ Certificate

ต้องมีการตรวจสอบสิทธิ์ก่อนส่งออกข้อมูล

## 12.2 PDF Executive Summary

ระบบสามารถสร้างรายงานสรุปผู้บริหาร เช่น:

* จำนวนผู้สมัคร  
* จำนวนผู้เข้าร่วมจริง  
* อัตราการเข้าร่วม (%)  
* ระยะทางรวม  
* Calories รวม  
* จำนวนผู้ได้รับ POINT  
* จำนวนผู้ได้รับ EXP  
* Referral Statistics  
* Viral Coefficient

ตัวชี้วัด Viral Coefficient ต้องมีนิยามการคำนวณที่ชัดเจนก่อนนำไปใช้รายงานจริง ไม่ควรใช้สูตรที่ AI คิดขึ้นเอง

## 12.3 Dashboard

รองรับมุมมอง:

* รายกิจกรรม  
* รายโครงการ  
* รายหน่วยงาน  
* ระดับมหาวิทยาลัย  
* รายปี  
* ราย Season

---

# PART 13: DATABASE DESIGN

## 13.1 เทคโนโลยีฐานข้อมูล

กำหนดให้ใช้ PostgreSQL เป็น Primary Database

ห้ามใช้ Google Sheets เป็นฐานข้อมูลหลัก

Frontend ติดต่อ Backend API เท่านั้น

Backend เป็นผู้จัดการข้อมูลทั้งหมดใน PostgreSQL

## 13.2 Technology Stack

แนวทางที่เสนอ:

Frontend:

* React หรือ Next.js  
* PWA  
* Responsive Design  
* Mobile-first

Backend:

* Node.js \+ NestJS หรือ FastAPI  
* RESTful API

ORM:

* Prisma หากเลือก NestJS/Node.js  
* ORM ที่เหมาะสมหากเลือก FastAPI

Database:

* PostgreSQL

Authentication:

* KKU Account / KKU SSO

File Storage:

* University Storage หรือ Object Storage

Source Code:

* GitHub

Deployment:

* Cloud Server ของมหาวิทยาลัย

ข้อเสนอเหล่านี้ยังต้องตรวจสอบความเหมาะสมกับสภาพแวดล้อมจริงของมหาวิทยาลัยก่อนยืนยัน Stack สุดท้าย

## 13.3 กลุ่มตารางที่ต้องออกแบบ

ชื่อตารางต่อไปนี้เป็นโครงสร้างตั้งต้น ต้องปรับ Normalization และความสัมพันธ์ให้เหมาะสมใน ERD จริง

### A. Organization

* organizations  
* departments  
* organization\_members

### B. Personnel & RBAC

* users  
* personnel\_profiles  
* roles  
* user\_roles  
* permissions  
* role\_permissions  
* staff\_assignments

### C. Projects

* projects  
* project\_managers  
* project\_categories

### D. Activities

* activities  
* activity\_sessions  
* activity\_types  
* registrations  
* attendance\_records

### E. Eligibility

* eligibility\_rules  
* eligibility\_conditions  
* user\_qualifications  
* activity\_prerequisites

### F. Activity Verification

* activity\_verification\_configs  
* activity\_pin\_codes  
* pin\_submissions  
* staff\_actions

### G. POINT

* point\_transactions  
* point\_balances

### H. EXP

* exp\_transactions  
* exp\_balances  
* exp\_levels

### I. KKU Healthy Life

ควรมีตารางเฉพาะสำหรับ:

* workout\_logs  
* workout\_providers  
* workout\_provider\_accounts  
* sport\_types  
* sport\_factors  
* scoring\_rules  
* scoring\_rule\_versions  
* workout\_validations  
* workout\_score\_results  
* fitness\_seasons  
* workout\_evidence

ชื่อจริงสามารถปรับได้ตาม ERD แต่ต้องเก็บข้อมูลการออกกำลังกาย สูตรคำนวณ ผลตรวจสอบ และประวัติย้อนหลังครบถ้วน

### J. Rewards

* rewards  
* reward\_eligibility\_rules  
* redemptions  
* inventory\_logs

### K. Referral

ควรมี:

* referral\_campaigns  
* referral\_codes  
* referral\_records  
* referral\_rewards

### L. Community

* communities  
* community\_members  
* community\_invitations  
* community\_posts  
* comments  
* community\_settings  
* community\_membership\_history  
* community\_cooldowns  
* community\_power\_snapshots

### M. Certificate

* certificate\_templates  
* certificate\_rules  
* certificates  
* certificate\_files  
* certificate\_verifications  
* certificate\_revisions

ต้องรองรับผู้ได้รับใบประกาศหลายคนได้ตามโครงสร้างที่เหมาะสม อาจใช้ certificates และ certificate\_recipients แยกกัน

### N. Annual Statistics

* annual\_point\_statistics  
* annual\_exp\_statistics  
* annual\_personnel\_summaries  
* annual\_activity\_records

### O. Voucher / Merchant

ควรมี:

* merchants  
* merchant\_accounts  
* vouchers  
* voucher\_redemptions

### P. Security & Audit

* notifications  
* audit\_logs  
* content\_reports  
* system\_settings  
* file\_assets

## 13.4 ข้อกำหนดทางเทคนิคของ Database

* ใช้ UUID สำหรับ Primary Key ตามความเหมาะสม  
* ใช้ UTF-8  
* ใช้ TIMESTAMPTZ สำหรับเวลา  
* ใช้ Asia/Bangkok เป็น Business Timezone  
* กำหนด Foreign Key  
* กำหนด Unique Constraints  
* กำหนด Indexes  
* ออกแบบ Soft Delete เฉพาะตารางที่จำเป็น  
* มี Database Migration  
* มี Backup / Restore  
* มี Connection Pooling  
* มี Audit Log  
* ป้องกัน Duplicate Transactions  
* ป้องกัน Race Conditions  
* ใช้ Transaction สำหรับธุรกรรมสำคัญ  
* มีแผน Retention และการคุ้มครองข้อมูล

---

# PART 14: API SPECIFICATION

ต้องออกแบบ RESTful API โดยแยกตามโมดูล

ตัวอย่างกลุ่ม API:

Authentication:

* /api/auth/login  
* /api/auth/callback  
* /api/auth/me  
* /api/auth/logout

Organizations:

* /api/organizations  
* /api/organizations/{id}/members

Projects:

* /api/projects  
* /api/projects/{id}  
* /api/projects/{id}/activities

Activities:

* /api/activities  
* /api/activities/{id}  
* /api/activities/{id}/register  
* /api/activities/{id}/check-in

Attendance:

* /api/attendance/scan  
* /api/attendance/passcode  
* /api/attendance/verify

Healthy Life:

* /api/healthy-life/seasons  
* /api/healthy-life/workouts  
* /api/healthy-life/workouts/sync  
* /api/healthy-life/workouts/validate  
* /api/healthy-life/workouts/calculate  
* /api/healthy-life/leaderboard

POINT:

* /api/wallet/points  
* /api/wallet/transactions

EXP:

* /api/wallet/exp  
* /api/exp/levels

Referral:

* /api/referrals  
* /api/referrals/campaigns  
* /api/referrals/claim

Community:

* /api/communities  
* /api/communities/{id}/members  
* /api/communities/{id}/posts  
* /api/communities/{id}/challenges

Marketplace:

* /api/rewards  
* /api/rewards/{id}/redeem  
* /api/vouchers  
* /api/vouchers/verify

Certificates:

* /api/certificates  
* /api/certificates/{id}  
* /api/certificates/{id}/verify

Analytics:

* /api/analytics/activities  
* /api/analytics/organizations  
* /api/analytics/annual  
* /api/analytics/export

API ทั้งหมดต้องมี:

* Authentication  
* Authorization  
* Input Validation  
* Error Handling  
* Pagination  
* Rate Limiting ตามความเหมาะสม  
* Audit Logging  
* Idempotency สำหรับคำขอที่เกี่ยวข้องกับธุรกรรม

รายการข้างต้นเป็น API Outline ไม่ใช่ API Contract ฉบับสมบูรณ์ ต้องจัดทำ Request/Response Schema, HTTP Status, Error Codes และ Permission Matrix เพิ่มเติม

---

# PART 15: SYSTEM SECURITY & DATA INTEGRITY

ต้องออกแบบระบบโดยคำนึงถึง:

1. KKU SSO  
2. RBAC  
3. API Security  
4. HTTPS  
5. Secure Session Management  
6. CSRF Protection ตามรูปแบบ Authentication  
7. Input Validation  
8. SQL Injection Prevention  
9. XSS Protection  
10. Rate Limiting  
11. Audit Log  
12. File Access Control  
13. Privacy Protection  
14. Backup and Recovery  
15. Disaster Recovery  
16. Transaction Integrity  
17. Duplicate Submission Prevention  
18. QR Token Security  
19. Passcode Expiration  
20. Merchant Authorization

ข้อมูลสุขภาพและข้อมูลส่วนบุคคลต้องมีการควบคุมสิทธิ์และจัดเก็บเท่าที่จำเป็น รวมถึงตรวจสอบข้อกำหนด PDPA และนโยบายของมหาวิทยาลัยก่อนเปิดใช้งานจริง

---

# PART 16: USER EXPERIENCE & PWA

ระบบต้องออกแบบเป็น PWA ที่ใช้งานผ่านมือถือและ Desktop ได้

ข้อกำหนด:

* Mobile-first  
* Responsive  
* รองรับการติดตั้งบนอุปกรณ์  
* รองรับการใช้งานผ่าน Browser  
* Navigation ชัดเจน  
* แสดงสถานะการสมัครและการเข้าร่วม  
* แสดง POINT และ EXP  
* แสดงระดับ  
* แสดงรางวัล  
* แสดงใบประกาศ  
* แสดงกิจกรรม  
* แสดงชุมชน  
* รองรับการสแกน QR ด้วยกล้องเมื่อได้รับอนุญาต  
* รองรับการแสดง QR Ticket  
* รองรับ Dynamic QR Voucher  
* แสดง Countdown ของ Voucher  
* แสดงสถานะการ Sync Workout

ไม่ควรสมมติว่า GPS, Camera, Background Sync หรือการทำงาน Offline จะรองรับเหมือนกันทุก Browser และอุปกรณ์ ต้องมี Fallback ที่เหมาะสม

---

# PART 17: SYSTEM BLUEPRINT & TECHNICAL DELIVERABLES

เอกสารและผลงานที่ต้องจัดทำให้ครบ:

## 17.1 System Blueprint

* System Overview  
* System Architecture  
* Module Architecture  
* Component Diagram  
* Deployment Diagram  
* Data Flow Diagram

## 17.2 Business Rules

* RBAC Rules  
* Project Rules  
* Activity Rules  
* Eligibility Rules  
* Registration Rules  
* Check-in Rules  
* POINT Rules  
* EXP Rules  
* Qualification Rules  
* Healthy Life Scoring Rules  
* Anti-Cheat Rules  
* Referral Rules  
* Marketplace Rules  
* Voucher Rules  
* Community Rules  
* Certificate Rules  
* Annual Statistics Rules

## 17.3 User Flow

ต้องจัดทำแยกตาม:

* User  
* Staff  
* Department Admin  
* Super Admin  
* Merchant

## 17.4 Database Deliverables

* ERD  
* Database Schema  
* Data Dictionary  
* Table Relationships  
* Index Design  
* Constraints  
* Migration Plan

## 17.5 API Deliverables

* REST API Specification  
* Endpoint List  
* Request/Response  
* Error Codes  
* Authentication  
* Authorization  
* API Versioning

## 17.6 TOR

จัดทำเอกสารข้อกำหนดขอบเขตงานที่ครอบคลุม:

* วัตถุประสงค์  
* ขอบเขตงาน  
* Functional Requirements  
* Non-Functional Requirements  
* Technology Requirements  
* Security Requirements  
* Deliverables  
* Testing  
* Acceptance Criteria  
* Maintenance

## 17.7 Interactive PWA Prototype

ต้องมี Prototype ที่สามารถทดลองใช้งานและจำลอง Flow สำคัญได้ ไม่ใช่ภาพหน้าจอแบบ Static เท่านั้น

---

# PART 18: BUSINESS RULES ที่ต้องระวังเป็นพิเศษ

## 18.1 POINT ไม่ใช่ EXP

POINT ใช้แลกรางวัล EXP ใช้สะสมประสบการณ์

## 18.2 EXP ไม่ใช่ Qualification

การมี EXP สูงไม่ได้หมายความว่าจะผ่านหลักสูตรหรือได้รับสิทธิ์ทุกอย่าง

## 18.3 Qualification ไม่ใช่ Certificate

Qualification คือสิทธิ์หรือคุณสมบัติ ส่วน Certificate คือเอกสารรับรอง

## 18.4 การลงทะเบียนไม่เท่ากับการผ่านกิจกรรมเสมอไป

ต้องตรวจสอบตาม Activity Verification Mode

## 18.5 POINT ที่ใช้แลกแล้วต้องมีประวัติ

ต้องเก็บ Transaction Ledger

## 18.6 การออกจากกลุ่มไม่ทำให้ EXP ลด

แต่ Group Power ลดตาม EXP ของสมาชิกที่ออก

## 18.7 ใบประกาศต้องตรวจสอบได้

ต้องมี QR Verification และสถานะใบประกาศ

## 18.8 สูตร Healthy Life ต้องมีเวอร์ชัน

ห้ามแก้สูตรย้อนหลังแล้วทำให้ผลคะแนนเดิมเปลี่ยนโดยไม่มีการ Recalculate และ Audit ที่ได้รับอนุญาต

## 18.9 Referral Bonus ต้องให้เมื่อผ่านเงื่อนไข

ไม่ให้โบนัสเพียงเพราะเปิดลิงก์หรือสมัครกิจกรรม

## 18.10 Voucher ต้องใช้ได้ครั้งเดียวตามเงื่อนไข

Dynamic QR อายุ 5 นาที และต้องตรวจสอบจาก Backend

## 18.11 Capacity ต้องป้องกันสมัครเกิน

ค่า 0 หมายถึงไม่จำกัดจำนวนตามข้อกำหนดล่าสุด

## 18.12 Group Limit และ Cooldown ต้องตรวจสอบแบบ Transaction-safe

ห้ามให้สมาชิกเข้ากลุ่มเกินจำนวนที่กำหนดจากการส่งคำขอพร้อมกัน

---

# PART 19: OPEN QUESTIONS & ITEMS REQUIRING CONFIRMATION

รายการต่อไปนี้เป็นประเด็นที่ยังไม่มีข้อสรุปครบถ้วน ห้าม AI Model คิดคำตอบแทนผู้รับผิดชอบ

## 19.1 Healthy Life Scoring

1. Duration Multiplier (%) ใช้ค่าเป็นเปอร์เซ็นต์ เช่น 100% หรือใช้ค่า 1.0 ในการคำนวณ?  
2. Special Event Multiplier มีค่าเริ่มต้นเท่าใด?  
3. Duration Multiplier กำหนดตามช่วงเวลาอย่างไร?  
4. มีคะแนนสูงสุดต่อรายการ ต่อวัน หรือ ต่อ Season หรือไม่?  
5. มีการปัดเศษคะแนนอย่างไร?  
6. Workout Score ถูกนำเข้า POINT โดยตรงหรือผ่านขั้นตอนแปลงคะแนน?  
7. Workout แต่ละครั้งได้รับ EXP ด้วยหรือไม่?  
8. ต้องตรวจสอบหลักฐานก่อนอนุมัติทุกครั้งหรือไม่?  
9. การ Sync จาก Provider ใดจะรองรับใน MVP?  
10. Pace มากกว่า 12 min/km ปรับเป็น Walking ตามข้อกำหนดที่ให้มา แต่มีเงื่อนไขเพิ่มเติมสำหรับกีฬาประเภทอื่นหรือไม่?

## 19.2 EXP Level

1. ตาราง Level อย่างเป็นทางการจะใช้ช่วงใด?  
2. ยืนยันเงื่อนไขสร้าง Club ที่ 10,000 EXP หรือ Level 5 ตามชื่อระดับ?  
3. EXP สามารถลดจากการปรับแก้หรือ Rollback ได้ในกรณีใดบ้าง?

## 19.3 Event Verification

1. GPS Geo-Fence ใช้รัศมีกี่เมตร?  
2. Passcode มีอายุกี่นาที?  
3. เปลี่ยน Passcode อัตโนมัติหรือ Staff เป็นผู้เปลี่ยน?  
4. กิจกรรมใดบ้างที่ต้องมี Check-in และ Check-out?  
5. มีการรองรับหลาย Session ต่อกิจกรรมหรือไม่ใน MVP?

## 19.4 Referral

1. ผู้ใช้สามารถเชิญตนเองผ่านบัญชีอื่นได้หรือไม่? ต้องป้องกันการทุจริตอย่างไร?  
2. โบนัสให้เมื่อ Check-in หรือเมื่อผ่านกิจกรรม?  
3. สามารถใช้ Referral Code กับกิจกรรมหลายกิจกรรมได้หรือไม่?  
4. โบนัสมีวันหมดอายุหรือไม่?

## 19.5 Marketplace

1. ร้านค้าพันธมิตรมีระบบรับรองหรือยืนยันการใช้งานอย่างไร?  
2. Voucher ใช้กับสินค้าหรือบริการประเภทใด?  
3. QR อายุ 5 นาทีเริ่มนับตั้งแต่สร้างหรือเปิดแสดง?  
4. การยกเลิก Voucher หลังออกแล้วทำได้หรือไม่?

## 19.6 Community

1. ยืนยันจำนวนกลุ่มสูงสุดเริ่มต้นที่ 3 กลุ่มหรือไม่?  
2. ยืนยัน Cooldown 36 วันหรือไม่?  
3. Cooldown ใช้กับการออกจากทุกกลุ่มหรือเฉพาะบางกลุ่ม?  
4. ใครสามารถลบสมาชิกหรือปิดกลุ่ม?  
5. Mini-Challenge ให้ POINT/EXP ได้หรือไม่ และต้องใช้กติกาใด?

## 19.7 Infrastructure

1. Cloud Server ของมหาวิทยาลัยมี CPU, RAM, Storage และ Network เท่าใด?  
2. มี PostgreSQL Server หรือ Cluster พร้อมใช้งานแล้วหรือไม่?  
3. มี Object Storage หรือ University Storage แบบใด?  
4. มี SSO Integration Documentation หรือ API ให้ทีมพัฒนาหรือไม่?  
5. ต้องรองรับ Concurrent Users เท่าใด?  
6. มีข้อกำหนดเรื่อง Data Residency และ Backup Retention อย่างไร?

---

# PART 20: DEVELOPMENT ROADMAP

เสนอให้แบ่งการพัฒนาเป็น Phase โดยต้องไม่ตัดข้อกำหนดหลักออกจาก System Blueprint

## Phase 0: Requirement & Architecture

* ยืนยัน Business Rules  
* สรุป System Blueprint  
* สรุป ERD  
* สรุป API  
* กำหนด Infrastructure  
* จัดทำ TOR  
* จัดทำ Prototype

## Phase 1: Core Platform

* KKU SSO  
* User Management  
* 5-Tier RBAC  
* Organization Management  
* Project Management  
* Activity Management  
* Registration  
* Attendance  
* Staff Assignment  
* Basic Dashboard

## Phase 2: POINT / EXP / Qualification

* POINT Wallet  
* EXP Ledger  
* EXP Level  
* Qualification Engine  
* Eligibility Engine  
* Reward Management  
* Annual Statistics

## Phase 3: KKU Healthy Life

* Workout Submission  
* Workout Provider Integration  
* Sport Mapping  
* Scoring Engine  
* Anti-Cheat  
* Workout Validation  
* Fitness Dashboard  
* Leaderboard  
* Season Management

## Phase 4: Community & Referral

* Social Community  
* Club Management  
* Group Power  
* Level-based Club Creation  
* Cooldown  
* Mini-Challenge  
* Referral Engine

## Phase 5: Marketplace & Certificate

* Central Marketplace  
* Inventory Management  
* Merchant Interface  
* Dynamic QR Voucher  
* Digital Certificate  
* QR Verification  
* Achievement Portfolio

## Phase 6: Analytics & Production Readiness

* Excel/CSV Export  
* PDF Executive Summary  
* Executive Dashboard  
* Security Testing  
* Load Testing  
* Backup/Restore Testing  
* UAT  
* Production Deployment

การแบ่ง Phase เป็นข้อเสนอด้านลำดับการพัฒนา ไม่ได้หมายความว่าโมดูลที่อยู่ Phase หลังสามารถตัดออกจากการออกแบบฐานข้อมูลและสถาปัตยกรรมตั้งแต่ต้นได้

---

# PART 21: INSTRUCTIONS TO THE NEXT AI MODEL

เมื่อรับเอกสารฉบับนี้แล้ว ให้ดำเนินการดังนี้:

1. อ่านและทำความเข้าใจข้อกำหนดทั้งหมด  
2. จัดทำ Requirement Traceability Matrix เพื่อเชื่อมทุกข้อกำหนดกับโมดูล ฐานข้อมูล API และ Test Case  
3. แยก Confirmed Requirements, Proposed Design และ Open Questions  
4. ตรวจสอบความขัดแย้งของ Business Rules ก่อนเริ่มเขียนโค้ด  
5. จัดทำ System Blueprint ฉบับสมบูรณ์  
6. ออกแบบ PostgreSQL ERD ให้รองรับทุกโมดูล  
7. ออกแบบ REST API  
8. จัดทำ Role Permission Matrix  
9. จัดทำ User Flow ทุกบทบาท  
10. จัดทำ Test Scenarios และ Acceptance Criteria  
11. วางแผน MVP และ Deployment  
12. ห้ามเริ่มสร้างระบบจริงโดยละเลยข้อกำหนดในเอกสารนี้

หากต้องเลือกแนวทางทางเทคนิค ให้เลือกแนวทางที่เหมาะกับ Cloud Server ของมหาวิทยาลัย ควบคุมค่าใช้จ่ายได้ และรองรับการขยายระบบในอนาคต

หลักการสำคัญที่สุด:

Smart KKU Platform ต้องเป็นแพลตฟอร์มกลาง ไม่ใช่เพียงระบบจัดกิจกรรม และ KKU Healthy Life ต้องเป็นโมดูลหลักที่มี Scoring Engine และ Workout Verification ของตนเอง

ทุกโมดูลต้องทำงานร่วมกันได้ โดยไม่ทำให้ POINT, EXP, Qualification, Reward, Community และ Achievement สูญเสียความหมายเฉพาะของตนเอง

END OF MASTER PROJECT HANDOVER

\*\*\*\*\*\*

## **7\. ข้อกำหนดที่ AI Model ต้องปฏิบัติตาม**

ให้นำข้อความนี้เพิ่มลงในคำสั่งหลักของเอกสาร Master Project Handover:

> Smart KKU Platform ต้องมีระบบคะแนน 4 ประเภท ได้แก่ POWER, POINT, EXP และ QUALIFICATION โดย POWER เป็นคะแนนเฉพาะจาก KKU Healthy Life Scoring Engine สามารถนำไปแลกรางวัลที่กำหนดให้ใช้ POWER และสามารถแปลงเป็น EXP ได้ตามอัตราส่วนที่ Super Admin กำหนด เช่น 10 POWER \= 1 EXP การแปลงต้องบันทึกประวัติและหัก POWER ตามจำนวนที่ใช้จริง

> Central Marketplace ต้องรองรับการแลกรางวัลด้วย POWER, POINT หรือหลายประเภทพร้อมกันตามเงื่อนไขของรางวัล

> ผลการคำนวณ POWER ต้องปัดเป็นทศนิยม 2 ตำแหน่ง ส่วนการตีความ Duration Multiplier (%) ต้องระบุเป็น Business Rule อย่างชัดเจนก่อนเขียน Scoring Engine

> EXP Level ต้องเป็น Dynamic Configuration โดย Super Admin สามารถกำหนดชื่อระดับและช่วง EXP ของแต่ละ Level ได้เอง ห้าม Hardcode ชื่อหรือช่วงคะแนนไว้ใน Frontend หรือ Backend ทั้งนี้ สิทธิ์เฉพาะ เช่น การสร้าง Club เมื่อมี 10,000 EXP ต้องแยกเป็น Eligibility Rule ที่ปรับแต่งได้

# **SMART KKU PLATFORM**

## **PostgreSQL Database Design Specification v1.0**

**Document Type:** System Database Design & Technical Handover  
**Platform:** Smart KKU Platform  
**Database:** PostgreSQL  
**Version:** 1.0  
**Date:** 11 November 2026  
**Status:** Initial Design Baseline

---

# **PART 1: PROJECT CONTEXT AND DESIGN PRINCIPLES**

## **1.1 Project Overview**

Smart KKU Platform เป็นแพลตฟอร์มกลางสำหรับบุคลากรมหาวิทยาลัยขอนแก่น พัฒนาด้วยแนวคิด Progressive Web Application (PWA) เพื่อให้บุคลากรสามารถใช้งานผ่านโทรศัพท์มือถือและคอมพิวเตอร์ได้

ระบบใช้ KKU Account / KKU SSO เป็นระบบยืนยันตัวตนกลาง

KKU HR Experience เป็นแนวคิดในการออกแบบประสบการณ์บุคลากรภายใน Smart KKU Platform ไม่ใช่ชื่อระบบหลัก

KKU Healthy Life เป็นหนึ่งในโมดูลหลักของระบบ โดยเน้นการออกกำลังกาย การสะสม POWER การพัฒนาระดับ EXP และการสร้างแรงจูงใจผ่าน Community และ Gamification

ระบบต้องรองรับหลายหน่วยงาน แต่ละหน่วยงานสามารถสร้างโครงการและกิจกรรมของตนเองได้ โดยมี Super Admin จากกองทรัพยากรบุคคลเป็นผู้ดูแลภาพรวม

## **1.2 Database Architecture**

กำหนดให้ใช้:

* PostgreSQL เป็น Primary Database  
* ใช้ Database เดียวชื่อ `smart_kku_platform`  
* แบ่ง Database Schema ตามขอบเขตของโมดูล  
* Backend API เป็นช่องทางเดียวในการเข้าถึงฐานข้อมูล  
* Frontend ห้ามเชื่อมต่อ PostgreSQL โดยตรง  
* ใช้ UUID เป็น Primary Key มาตรฐาน  
* ใช้ TIMESTAMPTZ สำหรับวันและเวลา  
* ใช้ Asia/Bangkok เป็น Time Zone สำหรับการแสดงผลและสรุปข้อมูลรายปี  
* ใช้ NUMERIC/DECIMAL สำหรับคะแนนและค่าที่ต้องการความแม่นยำ  
* ใช้ Database Migration ในการควบคุมเวอร์ชันโครงสร้างฐานข้อมูล

ไม่ใช้ Google Sheets เป็น Primary Database

## **1.3 Proposed Database Schemas**

สร้าง Schema ดังต่อไปนี้:

| Schema | Responsibility |
| ----- | ----- |
| identity | User, SSO, Roles, Permissions |
| organization | Organization, Department, Organizational Structure |
| personnel | Personnel Profile, Employment Information |
| project | Projects, Activities, Sessions |
| attendance | Registration, Attendance, Verification |
| wallet | POINT, POWER, EXP, Qualification |
| healthylife | Workout, Sport Mapping, POWER Calculation |
| community | Groups, Members, Posts, Challenges |
| marketplace | Rewards, Inventory, Redemption, Merchant |
| certificate | Digital Certificates, Verification |
| referral | Referral Campaigns and Rewards |
| analytics | Annual Statistics and Reports |
| notification | Notifications |
| audit | Audit Logs |
| config | System Configuration and Feature Flags |

ให้สร้าง Schema ตามลำดับที่เหมาะสมกับ Foreign Key Dependencies โดยเริ่มจาก Core Database

## **1.4 Naming Convention**

* Schema: lowercase  
* Table: snake\_case และใช้ชื่อพหูพจน์  
* Column: snake\_case  
* Primary Key: `id`  
* Foreign Key: ชื่อ Entity ตามด้วย `_id`  
* Boolean: ใช้ `is_` หรือ `has_`  
* วันสร้าง: `created_at`  
* วันแก้ไข: `updated_at`  
* ผู้สร้าง: `created_by`  
* ผู้แก้ไข: `updated_by`  
* สถานะ: `status`  
* คะแนน: NUMERIC(18,2)

---

# **PART 2: CORE DATABASE DESIGN**

Core Database เป็นส่วนกลางที่ทุกโมดูลต้องใช้ร่วมกัน ต้องออกแบบให้เสร็จก่อนเริ่มพัฒนา Wallet Engine, Healthy Life Engine และโมดูลอื่น ๆ

## **2.1 Identity Schema**

### **Table: identity.users**

หน้าที่: จัดเก็บบัญชีผู้ใช้งานหลัก

| Column | Type | Constraint | Description |
| ----- | ----- | ----- | ----- |
| id | UUID | PK | User ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | KKU Email |
| display\_name | VARCHAR(255) | NOT NULL | ชื่อแสดงผล |
| status | VARCHAR(20) | NOT NULL | ACTIVE, INACTIVE, SUSPENDED |
| last\_login\_at | TIMESTAMPTZ | NULL | Login ล่าสุด |
| created\_at | TIMESTAMPTZ | NOT NULL | วันสร้าง |
| updated\_at | TIMESTAMPTZ | NOT NULL | วันแก้ไข |

ข้อกำหนด:

* ผู้ใช้ต้องยืนยันตัวตนผ่าน KKU SSO  
* บัญชีที่ได้รับอนุญาตต้องเป็นบัญชีบุคลากรตามนโยบายมหาวิทยาลัย  
* ไม่เก็บ KKU Password  
* Email ต้องผ่านการตรวจสอบจากแหล่งข้อมูลที่เชื่อถือได้ ไม่ใช้ Email ที่ผู้ใช้กรอกเองเป็นหลักฐานยืนยันตัวตน

### **Table: identity.external\_identities**

ใช้เชื่อมโยงบัญชีในระบบกับ KKU SSO

| Column | Type | Description |
| ----- | ----- | ----- |
| id | UUID PK | Identity ID |
| user\_id | UUID FK | ผู้ใช้งาน |
| provider | VARCHAR(50) | KKU\_SSO |
| provider\_subject | VARCHAR(255) | External Subject ID |
| created\_at | TIMESTAMPTZ | วันเชื่อมต่อ |

Constraint:

* UNIQUE(provider, provider\_subject)  
* หนึ่ง External Identity ต้องเชื่อมกับ User ที่ถูกต้อง  
* ห้ามเก็บ Access Token หรือ Secret โดยไม่มีความจำเป็นและมาตรการป้องกัน

### **Table: identity.roles**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| code | VARCHAR(50) UNIQUE |
| name | VARCHAR(100) |
| description | TEXT |
| is\_active | BOOLEAN |
| created\_at | TIMESTAMPTZ |

Initial Role Codes:

* USER  
* STAFF  
* DEPARTMENT\_ADMIN  
* SUPER\_ADMIN  
* MERCHANT

### **Table: identity.permissions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| code | VARCHAR(100) UNIQUE |
| description | TEXT |

ตัวอย่าง Permission:

* PROJECT\_CREATE  
* PROJECT\_UPDATE  
* ACTIVITY\_CREATE  
* ACTIVITY\_MANAGE  
* ATTENDANCE\_SCAN  
* POWER\_CONFIGURE  
* WALLET\_ADJUST  
* REWARD\_MANAGE  
* CERTIFICATE\_ISSUE  
* REPORT\_VIEW  
* SYSTEM\_ADMIN

### **Table: identity.role\_permissions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| role\_id | UUID FK |
| permission\_id | UUID FK |

Constraint:

* UNIQUE(role\_id, permission\_id)

### **Table: identity.user\_roles**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK |
| role\_id | UUID FK |
| assigned\_by | UUID FK |
| assigned\_at | TIMESTAMPTZ |
| expires\_at | TIMESTAMPTZ NULL |
| is\_active | BOOLEAN |

Constraint:

* UNIQUE(user\_id, role\_id)

### **Table: identity.user\_role\_scopes**

ใช้กำหนดขอบเขตของบทบาท

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_role\_id | UUID FK |
| scope\_type | VARCHAR(30) |
| scope\_id | UUID |
| created\_at | TIMESTAMPTZ |

Scope Type:

* ORGANIZATION  
* PROJECT  
* ACTIVITY

ต้องตรวจสอบความสัมพันธ์ของ Scope กับ Entity จริงใน Backend ไม่อนุญาตให้กำหนด Scope ID โดยไม่ตรวจสอบประเภทข้อมูล

หลักการ:

* STAFF ต้องเห็นเฉพาะกิจกรรมที่ได้รับมอบหมาย  
* DEPARTMENT\_ADMIN ต้องเห็นเฉพาะขอบเขตหน่วยงานที่รับผิดชอบ  
* SUPER\_ADMIN มีสิทธิ์ระดับ Platform  
* USER และ STAFF สามารถเป็นบทบาทของบุคคลเดียวกันได้

---

## **2.2 Organization Schema**

### **Table: organization.organizations**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| code | VARCHAR(50) UNIQUE |
| name\_th | VARCHAR(255) |
| name\_en | VARCHAR(255) NULL |
| organization\_type | VARCHAR(50) |
| parent\_id | UUID FK NULL |
| is\_active | BOOLEAN |
| created\_at | TIMESTAMPTZ |
| updated\_at | TIMESTAMPTZ |

รองรับโครงสร้างหน่วยงานแบบ Parent-Child

ตัวอย่าง:  
มหาวิทยาลัย → คณะ / สำนัก / กอง → หน่วยงานย่อย

### **Table: organization.organization\_members**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| organization\_id | UUID FK |
| user\_id | UUID FK |
| membership\_type | VARCHAR(50) |
| effective\_from | DATE |
| effective\_to | DATE NULL |
| is\_primary | BOOLEAN |
| created\_at | TIMESTAMPTZ |

ต้องเก็บประวัติการเปลี่ยนสังกัดบุคลากร ไม่เขียนทับประวัติเดิม

---

## **2.3 Personnel Schema**

### **Table: personnel.profiles**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK UNIQUE |
| personnel\_code | VARCHAR(50) UNIQUE NULL |
| title\_name | VARCHAR(100) NULL |
| first\_name | VARCHAR(150) |
| last\_name | VARCHAR(150) |
| personnel\_type | VARCHAR(50) |
| employment\_status | VARCHAR(50) |
| position\_name | VARCHAR(255) NULL |
| created\_at | TIMESTAMPTZ |
| updated\_at | TIMESTAMPTZ |

ข้อมูลบุคลากรควรเชื่อมกับแหล่งข้อมูลบุคลากรที่มหาวิทยาลัยอนุญาตให้ใช้ โดยกำหนด Data Ownership และการปรับปรุงข้อมูลให้ชัดเจน

ข้อมูลส่วนบุคคลต้องกำหนดสิทธิ์การอ่านและแก้ไขตามความจำเป็น

---

# **PART 3: PROJECT AND ACTIVITY CORE**

## **3.1 Entity Hierarchy**

กำหนดความสัมพันธ์ดังนี้:

Organization → Project → Activity → Session

ความหมาย:

* Organization: หน่วยงานเจ้าของ  
* Project: โครงการหลัก  
* Activity: กิจกรรมย่อย  
* Session: รอบหรือช่วงเวลาของกิจกรรม

ตัวอย่าง:

กองทรัพยากรบุคคล

* Project: KKU Healthy Life 8  
  * Activity: เดินเพื่อสุขภาพ  
    * Session: รอบเช้า  
    * Session: รอบเย็น  
  * Activity: เต้นแอโรบิค

## **3.2 Tables**

### **project.projects**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| organization\_id | UUID FK |
| code | VARCHAR(50) UNIQUE |
| name | VARCHAR(255) |
| description | TEXT |
| start\_date | DATE |
| end\_date | DATE |
| status | VARCHAR(30) |
| created\_by | UUID FK |
| created\_at | TIMESTAMPTZ |
| updated\_at | TIMESTAMPTZ |

### **project.activities**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| project\_id | UUID FK |
| code | VARCHAR(50) |
| name | VARCHAR(255) |
| description | TEXT |
| activity\_type | VARCHAR(50) |
| registration\_start\_at | TIMESTAMPTZ NULL |
| registration\_end\_at | TIMESTAMPTZ NULL |
| capacity | INTEGER |
| verification\_method | VARCHAR(30) |
| status | VARCHAR(30) |
| created\_at | TIMESTAMPTZ |
| updated\_at | TIMESTAMPTZ |

Capacity:

* NULL หรือ 0 ให้กำหนดความหมายตามกติกาที่เจ้าของระบบยืนยัน  
* หากกำหนดจำนวนรับ ต้องป้องกันการลงทะเบียนเกินจำนวนด้วย Transaction

Verification Method:

* DIRECT  
* GEO\_FENCE  
* QR\_PASSCODE

### **project.activity\_sessions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| activity\_id | UUID FK |
| name | VARCHAR(255) |
| start\_at | TIMESTAMPTZ |
| end\_at | TIMESTAMPTZ |
| capacity | INTEGER NULL |
| status | VARCHAR(30) |
| created\_at | TIMESTAMPTZ |

### **attendance.registrations**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| activity\_id | UUID FK |
| user\_id | UUID FK |
| status | VARCHAR(30) |
| registered\_at | TIMESTAMPTZ |
| cancelled\_at | TIMESTAMPTZ NULL |

Constraint:

* UNIQUE(activity\_id, user\_id) สำหรับการลงทะเบียนแบบหนึ่งคนต่อกิจกรรม  
* หากกิจกรรมต้องลงทะเบียนแยกตาม Session ให้ขยาย Unique Constraint ให้รองรับ Session ตามกติกา

### **attendance.attendance\_records**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| registration\_id | UUID FK |
| session\_id | UUID FK NULL |
| user\_id | UUID FK |
| attendance\_status | VARCHAR(30) |
| verification\_method | VARCHAR(30) |
| verified\_at | TIMESTAMPTZ NULL |
| verified\_by | UUID FK NULL |
| created\_at | TIMESTAMPTZ |

การลงทะเบียนไม่เท่ากับการผ่านกิจกรรม ต้องแยกสถานะ Registration, Attendance และ Completion

---

# **PART 4: ERD \- CORE DATABASE**

ใช้ Mermaid ER Diagram ต่อไปนี้เป็น ERD ตั้งต้น โดย AI ผู้พัฒนาต้องนำไปตรวจสอบและสร้าง ERD ฉบับเต็มต่อไป

```
erDiagram
    USERS ||--o{ EXTERNAL_IDENTITIES : linked_to
    USERS ||--o{ USER_ROLES : assigned
    ROLES ||--o{ USER_ROLES : contains
    ROLES ||--o{ ROLE_PERMISSIONS : grants
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : included
    USER_ROLES ||--o{ USER_ROLE_SCOPES : scoped_by

    USERS ||--o| PERSONNEL_PROFILES : has
    USERS ||--o{ ORGANIZATION_MEMBERS : belongs
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : contains
    ORGANIZATIONS ||--o{ ORGANIZATIONS : parent_of

    ORGANIZATIONS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ ACTIVITIES : contains
    ACTIVITIES ||--o{ ACTIVITY_SESSIONS : schedules

    USERS ||--o{ REGISTRATIONS : registers
    ACTIVITIES ||--o{ REGISTRATIONS : receives
    REGISTRATIONS ||--o{ ATTENDANCE_RECORDS : generates
    ACTIVITY_SESSIONS ||--o{ ATTENDANCE_RECORDS : tracks

    USERS {
        uuid id PK
        varchar email UK
        varchar display_name
        varchar status
        timestamptz created_at
    }

    EXTERNAL_IDENTITIES {
        uuid id PK
        uuid user_id FK
        varchar provider
        varchar provider_subject
    }

    ROLES {
        uuid id PK
        varchar code UK
        varchar name
    }

    PERMISSIONS {
        uuid id PK
        varchar code UK
        varchar description
    }

    USER_ROLES {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
        boolean is_active
    }

    ORGANIZATIONS {
        uuid id PK
        uuid parent_id FK
        varchar code
        varchar name_th
    }

    PERSONNEL_PROFILES {
        uuid id PK
        uuid user_id FK
        varchar personnel_code
        varchar personnel_type
    }

    ORGANIZATION_MEMBERS {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        date effective_from
        date effective_to
    }

    PROJECTS {
        uuid id PK
        uuid organization_id FK
        varchar name
        varchar status
    }

    ACTIVITIES {
        uuid id PK
        uuid project_id FK
        varchar name
        varchar verification_method
        integer capacity
    }

    ACTIVITY_SESSIONS {
        uuid id PK
        uuid activity_id FK
        timestamptz start_at
        timestamptz end_at
    }

    REGISTRATIONS {
        uuid id PK
        uuid activity_id FK
        uuid user_id FK
        varchar status
    }

    ATTENDANCE_RECORDS {
        uuid id PK
        uuid registration_id FK
        uuid session_id FK
        varchar attendance_status
    }
```

หมายเหตุ: Mermaid Diagram นี้เป็น ERD เชิงตรรกะ ไม่ใช่ SQL DDL ที่สร้างฐานข้อมูลได้ทันที ตารางในแต่ละ Schema ต้องใช้ชื่อเต็มตามที่กำหนดในส่วนอื่นของเอกสาร

---

# **PART 5: WALLET ENGINE**

Wallet Engine เป็นโมดูลกลางสำหรับบริหารคะแนนและสิทธิประโยชน์ของบุคลากร

ต้องแยกคะแนน 4 ประเภทอย่างชัดเจน:

1. POINT: คะแนนกลาง ใช้แลกรางวัลทั่วไป  
2. POWER: คะแนนจากกิจกรรม KKU Healthy Life  
3. EXP: ค่าประสบการณ์ ใช้ Level และปลดล็อกสิทธิ์  
4. QUALIFICATION: คุณสมบัติหรือสิทธิ์ที่ได้รับจากการผ่านกิจกรรม

ห้ามรวมคะแนนทั้ง 3 ประเภทเป็นยอดเดียวกัน และห้ามแปลงคะแนนโดยอัตโนมัติ เว้นแต่มี Business Rule ที่กำหนดไว้อย่างชัดเจน

## **5.1 Wallet Architecture**

ใช้แนวคิด Ledger \+ Balance

Ledger เป็นประวัติธุรกรรมทั้งหมด

Balance เป็นยอดคงเหลือปัจจุบันเพื่อให้อ่านข้อมูลได้รวดเร็ว

ทุกการเปลี่ยนแปลงคะแนนต้องมี Ledger Record

ห้ามแก้ไขหรือลบธุรกรรมเก่าเพื่อปรับยอดโดยตรง ให้ใช้รายการ Adjustment หรือ Reversal

## **5.2 Wallet Tables**

### **wallet.point\_accounts**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK UNIQUE |
| balance | NUMERIC(18,2) |
| updated\_at | TIMESTAMPTZ |

### **wallet.point\_transactions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| account\_id | UUID FK |
| user\_id | UUID FK |
| transaction\_type | VARCHAR(30) |
| amount | NUMERIC(18,2) |
| balance\_after | NUMERIC(18,2) |
| reference\_type | VARCHAR(50) NULL |
| reference\_id | UUID NULL |
| idempotency\_key | VARCHAR(150) UNIQUE |
| description | TEXT NULL |
| created\_by | UUID FK NULL |
| created\_at | TIMESTAMPTZ |

### **wallet.power\_accounts**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK UNIQUE |
| balance | NUMERIC(18,2) |
| updated\_at | TIMESTAMPTZ |

### **wallet.power\_transactions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| account\_id | UUID FK |
| user\_id | UUID FK |
| transaction\_type | VARCHAR(30) |
| amount | NUMERIC(18,2) |
| balance\_after | NUMERIC(18,2) |
| reference\_type | VARCHAR(50) NULL |
| reference\_id | UUID NULL |
| idempotency\_key | VARCHAR(150) UNIQUE |
| description | TEXT NULL |
| created\_by | UUID FK NULL |
| created\_at | TIMESTAMPTZ |

### **wallet.exp\_accounts**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK UNIQUE |
| balance | NUMERIC(18,2) |
| updated\_at | TIMESTAMPTZ |

### **wallet.exp\_transactions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| account\_id | UUID FK |
| user\_id | UUID FK |
| transaction\_type | VARCHAR(30) |
| amount | NUMERIC(18,2) |
| balance\_after | NUMERIC(18,2) |
| reference\_type | VARCHAR(50) NULL |
| reference\_id | UUID NULL |
| idempotency\_key | VARCHAR(150) UNIQUE |
| description | TEXT NULL |
| created\_by | UUID FK NULL |
| created\_at | TIMESTAMPTZ |

ข้อกำหนด:

* amount เป็นบวกสำหรับ Credit และลบสำหรับ Debit  
* CHECK(amount \<\> 0\)  
* balance\_after เป็นยอดหลังทำรายการ  
* Ledger ต้องเรียงลำดับและตรวจสอบย้อนหลังได้  
* ห้าม UPDATE/DELETE Ledger โดย Application Role  
* Balance ต้องปรับพร้อม Ledger ภายใน Transaction เดียวกัน  
* การ Reversal ต้องสร้างรายการใหม่และอ้างอิงธุรกรรมเดิม  
* ทุกธุรกรรมที่มีการเรียกซ้ำต้องรองรับ Idempotency

## **5.3 Transaction Types**

ตัวอย่างประเภทธุรกรรม:

POINT:

* ACTIVITY\_REWARD  
* REFERRAL\_REWARD  
* REDEMPTION  
* ADMIN\_ADJUSTMENT  
* REVERSAL  
* REFUND

POWER:

* WORKOUT\_REWARD  
* SPECIAL\_EVENT\_REWARD  
* REDEMPTION  
* CONVERSION\_DEBIT  
* ADMIN\_ADJUSTMENT  
* REVERSAL

EXP:

* ACTIVITY\_REWARD  
* POWER\_CONVERSION  
* REFERRAL\_REWARD  
* ADMIN\_ADJUSTMENT  
* REVERSAL

ประเภทธุรกรรมจริงต้องผ่านการกำหนดมาตรฐานร่วมกันใน Backend และ Database

## **5.4 POWER to EXP Conversion**

### **Table: wallet.power\_conversion\_rules**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| rule\_code | VARCHAR(50) |
| power\_amount | NUMERIC(18,2) |
| exp\_amount | NUMERIC(18,2) |
| effective\_from | TIMESTAMPTZ |
| effective\_to | TIMESTAMPTZ NULL |
| is\_active | BOOLEAN |
| created\_by | UUID FK |
| created\_at | TIMESTAMPTZ |

ตัวอย่าง:

10 POWER \= 1 EXP

ต้องเก็บ Rate Version และช่วงเวลาที่มีผล

### **Table: wallet.power\_conversion\_transactions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK |
| conversion\_rule\_id | UUID FK |
| power\_amount | NUMERIC(18,2) |
| exp\_amount | NUMERIC(18,2) |
| power\_transaction\_id | UUID FK |
| exp\_transaction\_id | UUID FK |
| idempotency\_key | VARCHAR(150) UNIQUE |
| created\_at | TIMESTAMPTZ |

ข้อกำหนด:

* ต้องป้องกันการแปลงซ้ำ  
* ต้องบันทึกอัตราแปลงที่ใช้จริง  
* ต้องบันทึกทั้งรายการ POWER และ EXP  
* ควรหัก POWER และเพิ่ม EXP ใน Transaction เดียวกัน  
* หากรายการใดล้มเหลว ต้อง Rollback ทั้งหมด

**ยังรอการยืนยันจากเจ้าของระบบ:** การแปลง POWER เป็น EXP จะหัก POWER จริงหรือไม่ โดยข้อเสนอทางเทคนิคคือหัก POWER

ต้องกำหนดขั้นต่ำในการแปลง การปัดเศษ และการจัดการเศษคะแนนก่อน Production

## **5.5 EXP Levels**

### **Table: wallet.exp\_levels**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| level\_code | VARCHAR(50) UNIQUE |
| level\_name | VARCHAR(100) |
| level\_number | INTEGER |
| min\_exp | NUMERIC(18,2) |
| max\_exp | NUMERIC(18,2) NULL |
| is\_active | BOOLEAN |
| created\_at | TIMESTAMPTZ |

EXP Level ต้องตั้งค่าได้โดย Super Admin

ห้าม Hardcode Level ใน Frontend หรือ Backend

ตัวอย่างชื่อและช่วง EXP ที่เสนอเป็นเพียงตัวอย่าง ไม่ใช่ข้อกำหนดที่ล็อกตาย

การกำหนดสิทธิ์สร้าง Community ต้องใช้ Eligibility Rule เช่น Minimum EXP ไม่ควรผูกตายกับหมายเลข Level เนื่องจากช่วง Level อาจเปลี่ยนแปลงได้

## **5.6 Qualification**

### **Table: wallet.qualification\_types**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| code | VARCHAR(100) UNIQUE |
| name | VARCHAR(255) |
| description | TEXT |
| is\_active | BOOLEAN |

### **Table: wallet.user\_qualifications**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK |
| qualification\_type\_id | UUID FK |
| source\_activity\_id | UUID FK NULL |
| awarded\_at | TIMESTAMPTZ |
| expires\_at | TIMESTAMPTZ NULL |
| revoked\_at | TIMESTAMPTZ NULL |
| revoked\_by | UUID FK NULL |
| revocation\_reason | TEXT NULL |

ต้องเก็บที่มาของ Qualification เสมอ และรองรับการหมดอายุหรือเพิกถอน

## **5.7 Wallet Business Rules**

1. POINT, POWER, EXP ต้องมี Account และ Ledger แยกกัน  
2. ห้ามใช้ POWER แทน POINT โดยอัตโนมัติ  
3. POWER ใช้กับรางวัลที่กำหนดให้ใช้ POWER  
4. POINT ใช้กับรางวัลที่กำหนดให้ใช้ POINT  
5. รางวัลอาจกำหนดให้ใช้หลายสกุลเงินพร้อมกัน  
6. EXP ใช้กำหนด Level และสิทธิ์  
7. QUALIFICATION ใช้ตรวจสอบเงื่อนไขเฉพาะ  
8. การปรับคะแนนโดย Admin ต้องมีเหตุผล  
9. ห้ามลบประวัติธุรกรรม  
10. ต้องป้องกันยอดติดลบ เว้นแต่มี Business Rule ที่อนุมัติเป็นกรณีพิเศษ  
11. ต้องป้องกันการให้คะแนนซ้ำจาก Event หรือ API  
12. ต้องสามารถตรวจสอบยอดคงเหลือเทียบกับ Ledger ได้

---

# **PART 6: KKU HEALTHY LIFE ENGINE**

KKU Healthy Life เป็นโมดูลหลักของ Smart KKU Platform

หน้าที่:

* รับข้อมูลกิจกรรมออกกำลังกาย  
* เชื่อมต่อแหล่งข้อมูลภายนอกตามที่ได้รับอนุญาต  
* ตรวจสอบข้อมูลการออกกำลังกาย  
* Map ประเภทกีฬา  
* คำนวณ POWER  
* ส่งผลลัพธ์ไปยัง Wallet Engine  
* เก็บประวัติการคำนวณและการตรวจสอบ

## **6.1 Healthy Life Database Schema**

ใช้ Schema:

`healthylife`

ตารางที่ต้องออกแบบ:

1. workout\_logs  
2. workout\_sources  
3. connected\_accounts  
4. sport\_types  
5. sport\_factor\_configs  
6. special\_event\_factor\_configs  
7. duration\_multiplier\_configs  
8. scoring\_formula\_versions  
9. workout\_validation\_results  
10. workout\_calculations  
11. workout\_evidence  
12. workout\_approval\_records

## **6.2 workout\_sources**

จัดเก็บประเภทแหล่งข้อมูล

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| code | VARCHAR(50) UNIQUE |
| name | VARCHAR(100) |
| is\_active | BOOLEAN |

ตัวอย่าง:

* MANUAL  
* STRAVA  
* GARMIN  
* SMARTWATCH  
* OTHER

## **6.3 connected\_accounts**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK |
| source\_id | UUID FK |
| provider\_account\_id | VARCHAR(255) |
| connection\_status | VARCHAR(30) |
| connected\_at | TIMESTAMPTZ |
| disconnected\_at | TIMESTAMPTZ NULL |

ต้องออกแบบ OAuth และ Token Storage อย่างปลอดภัย ไม่จัดเก็บ Secret หรือ Access Token แบบ Plain Text

การเชื่อมต่อ Strava, Garmin และ Smartwatch ต้องตรวจสอบ API และเงื่อนไขของแต่ละผู้ให้บริการก่อน Implement

## **6.4 sport\_types**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| code | VARCHAR(50) UNIQUE |
| name | VARCHAR(100) |
| is\_active | BOOLEAN |
| created\_at | TIMESTAMPTZ |

ตัวอย่าง:

* RUNNING  
* WALKING  
* CYCLING  
* AEROBIC

## **6.5 sport\_factor\_configs**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| sport\_type\_id | UUID FK |
| factor\_value | NUMERIC(10,4) |
| effective\_from | TIMESTAMPTZ |
| effective\_to | TIMESTAMPTZ NULL |
| version | INTEGER |
| is\_active | BOOLEAN |
| created\_by | UUID FK |
| created\_at | TIMESTAMPTZ |

ตัวอย่าง Sport Factor:

| Sport | Factor |
| ----- | ----- |
| Running | 1.0 |
| Walking | 0.8 |
| Cycling | 0.7 |
| Aerobic | 0.9 |

Super Admin สามารถเปลี่ยนค่า Factor ได้

ห้ามแก้ไขค่า Factor เดิมโดยไม่เก็บประวัติหรือ Version

## **6.6 special\_event\_factor\_configs**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| event\_code | VARCHAR(100) |
| event\_name | VARCHAR(255) |
| factor\_value | NUMERIC(10,4) |
| effective\_from | TIMESTAMPTZ |
| effective\_to | TIMESTAMPTZ NULL |
| is\_active | BOOLEAN |

ใช้สำหรับกิจกรรมพิเศษที่ต้องการตัวคูณเพิ่มเติม

ต้องกำหนดวิธีเชื่อมโยง Special Event กับ Workout หรือ Campaign ให้ชัดเจน

## **6.7 duration\_multiplier\_configs**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| config\_name | VARCHAR(100) |
| multiplier\_value | NUMERIC(10,4) |
| effective\_from | TIMESTAMPTZ |
| effective\_to | TIMESTAMPTZ NULL |
| version | INTEGER |
| is\_active | BOOLEAN |

**OPEN DECISION:** เจ้าของระบบต้องยืนยันความหมายทางคณิตศาสตร์ของ Duration Multiplier (%)

ตัวอย่างที่ต้องยืนยัน:

* ค่า 100 หมายถึง 100% หรือ  
* ค่า 1.0 หมายถึง 100%

ห้าม AI Developer เลือกความหมายเอง

## **6.8 scoring\_formula\_versions**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| formula\_code | VARCHAR(100) |
| version | INTEGER |
| formula\_expression | TEXT |
| rounding\_precision | INTEGER |
| effective\_from | TIMESTAMPTZ |
| effective\_to | TIMESTAMPTZ NULL |
| is\_active | BOOLEAN |
| created\_by | UUID FK |
| created\_at | TIMESTAMPTZ |

สูตรปัจจุบัน:

POWER \=  
(Calories / Duration in Seconds)  
× Sport Factor  
× Special Event Factor  
× Duration Multiplier  
× 100

กำหนด Rounding Precision \= 2 Decimal Places

สูตรต้องจัดเก็บเป็น Version ไม่ควรเขียนสูตรตายไว้ใน Code โดยไม่มีระบบควบคุม Version

การเปลี่ยนสูตรต้องไม่ทำให้ผลคำนวณเก่าเปลี่ยนย้อนหลังโดยอัตโนมัติ

## **6.9 workout\_logs**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| user\_id | UUID FK |
| source\_id | UUID FK |
| external\_activity\_id | VARCHAR(255) NULL |
| selected\_sport\_type\_id | UUID FK NULL |
| started\_at | TIMESTAMPTZ |
| ended\_at | TIMESTAMPTZ |
| duration\_seconds | BIGINT |
| calories | NUMERIC(12,2) |
| distance\_meters | NUMERIC(14,2) NULL |
| average\_pace\_seconds\_per\_km | INTEGER NULL |
| average\_heart\_rate | INTEGER NULL |
| source\_payload | JSONB NULL |
| submission\_status | VARCHAR(30) |
| created\_at | TIMESTAMPTZ |

ข้อกำหนด:

* ต้องตรวจสอบ Duration มากกว่า 0  
* Calories ต้องผ่าน Validation  
* External Activity ID ต้องป้องกันการส่งซ้ำ  
* ต้องเก็บ Source และเวลาต้นทาง  
* ต้องแยกข้อมูลดิบออกจากผลการคำนวณ  
* หากมี GPS ให้จัดเก็บในรูปแบบที่มีการควบคุมสิทธิ์และการเก็บรักษาข้อมูล

## **6.10 workout\_validation\_results**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| workout\_log\_id | UUID FK |
| validation\_type | VARCHAR(50) |
| validation\_status | VARCHAR(30) |
| selected\_sport\_type\_id | UUID FK NULL |
| detected\_sport\_type\_id | UUID FK NULL |
| validation\_rule\_version | VARCHAR(50) NULL |
| reason | TEXT NULL |
| reviewed\_by | UUID FK NULL |
| reviewed\_at | TIMESTAMPTZ NULL |
| created\_at | TIMESTAMPTZ |

รองรับ:

* PACE\_VALIDATION  
* GPS\_VALIDATION  
* DURATION\_VALIDATION  
* CALORIE\_VALIDATION  
* DUPLICATE\_VALIDATION  
* MANUAL\_REVIEW

ตัวอย่าง Anti-Cheat:  
ผู้ใช้เลือก Running แต่ Pace ช้ากว่า 12 นาทีต่อกิโลเมตร ระบบอาจปรับ Sport Factor เป็น Walking 0.8 ตามกฎที่ Super Admin กำหนด

ค่า Threshold ต้องเป็น Configuration ไม่ Hardcode

ต้องเก็บ Selected Sport, Detected Sport, Applied Factor และเหตุผลของการปรับทุกครั้ง

## **6.11 workout\_calculations**

เป็นตารางเก็บผลการคำนวณ POWER โดยเฉพาะ

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| workout\_log\_id | UUID FK |
| formula\_version\_id | UUID FK |
| sport\_factor\_config\_id | UUID FK |
| special\_event\_factor\_config\_id | UUID FK NULL |
| duration\_multiplier\_config\_id | UUID FK |
| calories\_used | NUMERIC(12,2) |
| duration\_seconds\_used | BIGINT |
| applied\_sport\_factor | NUMERIC(10,4) |
| applied\_special\_event\_factor | NUMERIC(10,4) |
| applied\_duration\_multiplier | NUMERIC(10,4) |
| calculated\_power | NUMERIC(18,2) |
| calculation\_status | VARCHAR(30) |
| calculated\_at | TIMESTAMPTZ |
| created\_at | TIMESTAMPTZ |

ต้องเก็บค่าตัวคูณที่ใช้จริงเป็น Snapshot แม้ภายหลัง Super Admin จะเปลี่ยน Configuration แล้วก็ตาม

หนึ่ง Workout อาจมี Calculation หลายรายการเมื่อมีการคำนวณใหม่ แต่ต้องกำหนดให้ชัดเจนว่ารายการใดเป็นรายการที่ได้รับอนุมัติและส่งเข้ากระเป๋า POWER แล้ว

ห้ามคำนวณใหม่แล้วส่ง POWER เข้า Wallet ซ้ำ

## **6.12 workout\_approval\_records**

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| workout\_log\_id | UUID FK |
| calculation\_id | UUID FK |
| approval\_status | VARCHAR(30) |
| approved\_by | UUID FK NULL |
| approved\_at | TIMESTAMPTZ NULL |
| reason | TEXT NULL |
| created\_at | TIMESTAMPTZ |

ใช้สำหรับกรณีต้องตรวจสอบหรืออนุมัติก่อนให้ POWER

---

# **PART 7: HEALTHY LIFE TO WALLET INTEGRATION**

การคำนวณ POWER ต้องไม่ทำให้ Wallet Engine ถูกเรียกซ้ำโดยไม่ตั้งใจ

ลำดับการทำงาน:

1. บุคลากรส่งข้อมูล Workout  
2. Backend ตรวจสอบข้อมูล  
3. ตรวจสอบ Duplicate  
4. ตรวจสอบ Sport Mapping  
5. ตรวจสอบ Anti-Cheat  
6. เลือก Formula Version และ Factor Version  
7. คำนวณ POWER  
8. บันทึก Calculation Result  
9. ตรวจสอบว่าผ่านเงื่อนไขอนุมัติแล้ว  
10. สร้าง POWER Transaction  
11. ปรับ POWER Balance  
12. บันทึกความเชื่อมโยงระหว่าง Calculation และ Wallet Transaction

ต้องดำเนินการอย่าง Atomic Transaction หรือใช้ Transactional Outbox Pattern หากแยกการประมวลผลระหว่างโมดูล

ห้ามให้การ Retry จาก Queue หรือ API ทำให้ได้รับ POWER ซ้ำ

## **7.1 Required Relationship**

workout\_calculations ต้องเชื่อมโยงกับ Wallet Transaction ที่เกิดจาก Calculation นั้น

ให้ใช้ตารางเชื่อมโยง เช่น:

`healthylife.workout_power_awards`

| Column | Type |
| ----- | ----- |
| id | UUID PK |
| calculation\_id | UUID FK UNIQUE |
| power\_transaction\_id | UUID FK UNIQUE |
| awarded\_at | TIMESTAMPTZ |
| award\_status | VARCHAR(30) |

Constraint:

* หนึ่ง Calculation ที่ได้รับรางวัลต้องมี Award ได้เพียงหนึ่งรายการ  
* หนึ่ง POWER Transaction ต้องไม่ถูกนำมาอ้างอิงกับ Award ซ้ำ  
* ต้องรองรับการ Reversal โดยไม่ลบประวัติ Award เดิม

---

# **PART 8: ERD \- WALLET AND HEALTHY LIFE ENGINE**

```
erDiagram
    USERS ||--o| POWER_ACCOUNTS : owns
    USERS ||--o| POINT_ACCOUNTS : owns
    USERS ||--o| EXP_ACCOUNTS : owns

    POWER_ACCOUNTS ||--o{ POWER_TRANSACTIONS : records
    POINT_ACCOUNTS ||--o{ POINT_TRANSACTIONS : records
    EXP_ACCOUNTS ||--o{ EXP_TRANSACTIONS : records

    USERS ||--o{ WORKOUT_LOGS : submits
    WORKOUT_SOURCES ||--o{ WORKOUT_LOGS : provides
    SPORT_TYPES ||--o{ SPORT_FACTOR_CONFIGS : configured

    WORKOUT_LOGS ||--o{ WORKOUT_VALIDATION_RESULTS : validates
    WORKOUT_LOGS ||--o{ WORKOUT_CALCULATIONS : calculates
    SCORING_FORMULA_VERSIONS ||--o{ WORKOUT_CALCULATIONS : applies
    SPORT_FACTOR_CONFIGS ||--o{ WORKOUT_CALCULATIONS : uses

    WORKOUT_CALCULATIONS ||--o| WORKOUT_POWER_AWARDS : awards
    POWER_TRANSACTIONS ||--o| WORKOUT_POWER_AWARDS : credits

    USERS ||--o{ POWER_CONVERSION_TRANSACTIONS : converts
    POWER_CONVERSION_RULES ||--o{ POWER_CONVERSION_TRANSACTIONS : defines

    USERS ||--o{ USER_QUALIFICATIONS : earns
    QUALIFICATION_TYPES ||--o{ USER_QUALIFICATIONS : defines

    USERS {
        uuid id PK
        varchar email
    }

    POWER_ACCOUNTS {
        uuid id PK
        uuid user_id FK
        numeric balance
    }

    POWER_TRANSACTIONS {
        uuid id PK
        uuid account_id FK
        numeric amount
        numeric balance_after
        varchar transaction_type
    }

    POINT_ACCOUNTS {
        uuid id PK
        uuid user_id FK
        numeric balance
    }

    POINT_TRANSACTIONS {
        uuid id PK
        uuid account_id FK
        numeric amount
        numeric balance_after
    }

    EXP_ACCOUNTS {
        uuid id PK
        uuid user_id FK
        numeric balance
    }

    EXP_TRANSACTIONS {
        uuid id PK
        uuid account_id FK
        numeric amount
        numeric balance_after
    }

    WORKOUT_LOGS {
        uuid id PK
        uuid user_id FK
        uuid source_id FK
        bigint duration_seconds
        numeric calories
    }

    SPORT_TYPES {
        uuid id PK
        varchar code
        varchar name
    }

    SPORT_FACTOR_CONFIGS {
        uuid id PK
        uuid sport_type_id FK
        numeric factor_value
        integer version
    }

    SCORING_FORMULA_VERSIONS {
        uuid id PK
        varchar formula_code
        integer version
        integer rounding_precision
    }

    WORKOUT_CALCULATIONS {
        uuid id PK
        uuid workout_log_id FK
        uuid formula_version_id FK
        numeric calculated_power
    }

    WORKOUT_POWER_AWARDS {
        uuid id PK
        uuid calculation_id FK
        uuid power_transaction_id FK
    }
```

---

# **PART 9: DATABASE TRANSACTION REQUIREMENTS**

## **9.1 POWER Award Transaction**

เมื่อให้ POWER จาก Workout:

BEGIN;

1. ตรวจสอบ Workout Status  
2. ตรวจสอบ Calculation Status  
3. ตรวจสอบว่า Calculation ยังไม่เคยได้รับ Award  
4. Lock POWER Account ของ User  
5. Insert POWER Transaction  
6. Update POWER Balance  
7. Insert workout\_power\_awards  
8. Commit

COMMIT;

หากมีข้อผิดพลาดในขั้นตอนใด ให้ ROLLBACK ทั้งหมด

## **9.2 POWER Conversion Transaction**

BEGIN;

1. ตรวจสอบ Conversion Rule  
2. ตรวจสอบยอด POWER  
3. Lock POWER Account  
4. Lock EXP Account  
5. หัก POWER  
6. เพิ่ม EXP  
7. บันทึก Conversion Transaction  
8. Commit

COMMIT;

ต้องกำหนดลำดับการ Lock ให้เหมือนกันทุกเส้นทางเพื่อป้องกัน Deadlock

## **9.3 Database Concurrency**

ต้องรองรับ:

* Concurrent Wallet Transactions  
* Duplicate API Requests  
* Retry from Background Jobs  
* Simultaneous Reward Redemption  
* Concurrent Workout Submissions  
* Multiple Requests from the Same User

ใช้:

* Database Transactions  
* SELECT FOR UPDATE  
* Unique Constraints  
* Idempotency Keys  
* Atomic Updates  
* Appropriate Isolation Level

ห้ามอาศัยการตรวจสอบยอดคะแนนจาก Frontend เพียงอย่างเดียว

---

# **PART 10: INDEXES AND CONSTRAINTS**

ตัวอย่าง Index ที่ต้องพิจารณา:

```
CREATE INDEX idx_users_email
ON identity.users(email);

CREATE INDEX idx_organization_members_user
ON organization.organization_members(user_id);

CREATE INDEX idx_projects_organization
ON project.projects(organization_id);

CREATE INDEX idx_activities_project
ON project.activities(project_id);

CREATE INDEX idx_registrations_user
ON attendance.registrations(user_id);

CREATE INDEX idx_workouts_user_started
ON healthylife.workout_logs(user_id, started_at DESC);

CREATE INDEX idx_workouts_source_external
ON healthylife.workout_logs(source_id, external_activity_id);

CREATE INDEX idx_power_transactions_user_date
ON wallet.power_transactions(user_id, created_at DESC);

CREATE INDEX idx_point_transactions_user_date
ON wallet.point_transactions(user_id, created_at DESC);

CREATE INDEX idx_exp_transactions_user_date
ON wallet.exp_transactions(user_id, created_at DESC);
```

สำหรับ External Activity:

```
CREATE UNIQUE INDEX uq_workout_external_activity
ON healthylife.workout_logs(source_id, external_activity_id)
WHERE external_activity_id IS NOT NULL;
```

ต้องออกแบบ Unique Constraints ให้สอดคล้องกับกรณีที่แหล่งข้อมูลเดียวกันอาจส่ง Activity ID ซ้ำภายใต้บัญชีผู้ให้บริการต่างกัน โดยอาจต้องเพิ่ม Connected Account ID เข้าไปในเงื่อนไข Unique

---

# **PART 11: DATABASE SECURITY**

1. Backend Application ต้องใช้ Database Role ที่มีสิทธิ์เท่าที่จำเป็น  
2. ห้ามใช้ PostgreSQL Superuser เป็น Application Account  
3. แยก Migration Role ออกจาก Application Role  
4. กำหนด Row-Level Security สำหรับข้อมูลที่มีขอบเขตการเข้าถึง  
5. จำกัดการอ่านข้อมูลสุขภาพและ GPS  
6. เก็บ Consent สำหรับการเชื่อมต่อแหล่งข้อมูลสุขภาพ  
7. บันทึก Audit Log สำหรับการปรับคะแนนและการอนุมัติ  
8. ป้องกันการแก้ไข Ledger โดยตรง  
9. ใช้ TLS สำหรับ Database Connections ตามสภาพแวดล้อม  
10. สำรองข้อมูลและเข้ารหัส Backup  
11. ไม่เก็บ Token หรือ Secret เป็น Plain Text  
12. กำหนด Retention Policy สำหรับข้อมูลส่วนบุคคลและข้อมูลสุขภาพ

---

# **PART 12: MIGRATION AND IMPLEMENTATION ORDER**

ให้พัฒนาตามลำดับ:

Phase 1: Database Foundation

* Create PostgreSQL Database  
* Create Schemas  
* Create identity.users  
* Create external\_identities  
* Create roles and permissions  
* Create organizations  
* Create personnel profiles  
* Create initial indexes and constraints

Phase 2: Project Core

* Create projects  
* Create activities  
* Create activity\_sessions  
* Create registrations  
* Create attendance\_records  
* Create staff assignments and verification tables

Phase 3: Wallet Engine

* Create POINT Accounts and Transactions  
* Create POWER Accounts and Transactions  
* Create EXP Accounts and Transactions  
* Create Conversion Rules  
* Create Qualification Tables  
* Implement Transaction Services  
* Implement Idempotency

Phase 4: KKU Healthy Life

* Create Workout Sources  
* Create Connected Accounts  
* Create Sport Types  
* Create Sport Factor Configurations  
* Create Formula Versions  
* Create Workout Logs  
* Create Validation Results  
* Create Workout Calculations  
* Create Workout Power Awards

Phase 5: Other Platform Modules

* Community  
* Marketplace  
* Certificates  
* Referral  
* Analytics  
* Notifications  
* Audit

---

# **PART 13: REQUIRED DELIVERABLES FROM AI DEVELOPER**

AI Model ที่ได้รับเอกสารนี้ต้องจัดทำผลงานดังต่อไปนี้:

1. Complete ERD \- Full Platform  
2. Core Database ERD  
3. Wallet Engine ERD  
4. KKU Healthy Life Engine ERD  
5. PostgreSQL Schema SQL  
6. Complete CREATE TABLE SQL  
7. Primary Key and Foreign Key Definitions  
8. Unique Constraints and Check Constraints  
9. Index Definitions  
10. Data Dictionary  
11. Database Migration Files  
12. Seed Data for Initial Configuration  
13. Transaction Design  
14. Wallet Ledger and Balance Reconciliation Logic  
15. POWER Calculation Logic  
16. Workout Validation Rules  
17. Database Security and Privilege Design  
18. Sample SQL Queries  
19. Database Test Cases  
20. Backup and Recovery Plan

ต้องตรวจสอบ SQL ให้สามารถนำไปรันได้จริงบน PostgreSQL เวอร์ชันที่กำหนด

ห้ามส่งเฉพาะ ERD หรือ SQL ตัวอย่างโดยอ้างว่าเป็น Complete Database Design

---

# **PART 14: OPEN DECISIONS \- MUST NOT BE ASSUMED**

AI Developer ต้องแยกประเด็นต่อไปนี้ออกจากข้อกำหนดที่ยืนยันแล้ว และไม่ตัดสินใจแทนเจ้าของระบบ

1. POWER Conversion: หัก POWER จริงหรือไม่เมื่อแปลงเป็น EXP  
   * Proposed: หัก POWER และเพิ่ม EXP พร้อมกัน  
2. Duration Multiplier:  
   * 100 หมายถึง 100% หรือ  
   * 1.0 หมายถึง 100%  
3. Calories Source:  
   * รับจากอุปกรณ์เท่านั้นหรือ  
   * อนุญาต Manual Entry  
4. Workout Validation:  
   * ค่า Pace ขั้นต่ำ/สูงสุด  
   * Duration ขั้นต่ำ  
   * Calories Validation  
   * GPS Requirements  
5. Special Event Factor:  
   * กิจกรรมใดบ้างที่ใช้ตัวคูณพิเศษ  
   * ใช้ร่วมกับ Sport Factor อย่างไร  
6. POWER Award:  
   * ทุก Workout ได้ POWER อัตโนมัติหรือ  
   * ต้องผ่านการตรวจสอบก่อน  
7. EXP Conversion:  
   * ขั้นต่ำในการแปลง  
   * เพดานการแปลง  
   * การปัดเศษ  
   * การย้อนรายการ  
8. POINT and POWER Redemption:  
   * รองรับการใช้หลายสกุลเงินในรายการเดียว  
   * อนุญาตให้จ่ายบางส่วนหรือไม่  
9. Capacity:  
   * ค่า 0 หรือ NULL หมายถึงไม่จำกัดหรือไม่  
10. External Integration:  
* Strava API  
* Garmin API  
* Smartwatch Providers  
  ต้องตรวจสอบความเป็นไปได้และสิทธิ์การใช้งานก่อน Implementation

---

# **PART 15: STRICT DEVELOPMENT RULES**

1. ห้ามเปลี่ยนชื่อระบบหลัก Smart KKU Platform  
2. KKU HR Experience เป็นแนวคิดด้านประสบการณ์บุคลากรภายในระบบ  
3. KKU Healthy Life เป็นโมดูลหลัก ไม่ใช่ระบบแยก  
4. POINT, POWER และ EXP ต้องแยกกัน  
5. POWER มาจาก KKU Healthy Life Engine  
6. POWER สามารถแปลงเป็น EXP ตาม Conversion Rule  
7. QUALIFICATION ไม่ใช่คะแนน  
8. EXP Level ต้อง Dynamic Configuration  
9. ห้าม Hardcode Factor หรือ Conversion Rate  
10. ห้ามแก้ไขประวัติ Ledger โดยตรง  
11. ห้ามให้ Workout ได้ POWER ซ้ำ  
12. ห้ามให้ Reward Redemption หักคะแนนซ้ำ  
13. ห้ามให้ Admin เห็นข้อมูลนอก Scope  
14. ต้องมี Audit Trail  
15. ต้องรองรับการเพิ่มโมดูลในอนาคตโดยไม่ต้องรื้อ Core Database  
16. ต้องใช้ Database Migration ทุกครั้งที่เปลี่ยน Schema  
17. ต้องเขียน Automated Tests สำหรับ Business Rules  
18. ต้องตรวจสอบ Referential Integrity และ Transaction Consistency

**FINAL INSTRUCTION TO AI DEVELOPER**

เริ่มจากการตรวจสอบและปรับปรุง ERD และ Core Database ตามเอกสารนี้ก่อน

จากนั้นจัดทำ PostgreSQL DDL และ Migration ที่สมบูรณ์สำหรับ Core Database

เมื่อ Core Database ผ่านการตรวจสอบแล้ว จึงพัฒนา Wallet Engine และ KKU Healthy Life Engine ตามลำดับ

ห้ามเริ่มเขียน Frontend หรือสร้างระบบทั้งหมดพร้อมกันก่อนที่โครงสร้างฐานข้อมูลและ Business Rules หลักจะผ่านการทบทวน

ทุกการปรับเปลี่ยนที่แตกต่างจากเอกสารนี้ต้องอธิบายเหตุผล ผลกระทบ และขอการยืนยันก่อนเปลี่ยนกฎทางธุรกิจที่เจ้าของระบบกำหนดไว้

END OF DOCUMENT

