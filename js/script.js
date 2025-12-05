// ===========================  
// Global Variables  
// ===========================  
const navbar = document.getElementById('navbar');  
const mobileToggle = document.getElementById('mobileToggle');  
const navMenu = document.getElementById('navMenu');  
const navItems = document.querySelectorAll('.nav-item');  
const backToTop = document.getElementById('backToTop');  
const appointmentForm = document.getElementById('appointmentForm');  
const formAlert = document.getElementById('formAlert');  

// ===========================  
// Mobile Menu Toggle  
// ===========================  
mobileToggle.addEventListener('click', () => {  
    navMenu.classList.toggle('active');  
    mobileToggle.classList.toggle('active');  
});  

// Close mobile menu when clicking on nav item  
navItems.forEach(item => {  
    item.addEventListener('click', () => {  
        navMenu.classList.remove('active');  
        mobileToggle.classList.remove('active');  
    });  
});  

// Close mobile menu when clicking outside  
document.addEventListener('click', (e) => {  
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {  
        navMenu.classList.remove('active');  
        mobileToggle.classList.remove('active');  
    }  
});  

// ===========================  
// Navbar Scroll Effect  
// ===========================  
window.addEventListener('scroll', () => {  
    if (window.scrollY > 100) {  
        navbar.classList.add('scrolled');  
    } else {  
        navbar.classList.remove('scrolled');  
    }  
});  

// ===========================  
// Active Navigation on Scroll  
// ===========================  
const sections = document.querySelectorAll('section[id]');  

function activateNavOnScroll() {  
    const scrollY = window.pageYOffset;  

    sections.forEach(section => {  
        const sectionHeight = section.offsetHeight;  
        const sectionTop = section.offsetTop - 150;  
        const sectionId = section.getAttribute('id');  
        const navLink = document.querySelector(`.nav-item[href="#${sectionId}"]`);  

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {  
            navItems.forEach(item => item.classList.remove('active'));  
            if (navLink) {  
                navLink.classList.add('active');  
            }  
        }  
    });  
}  

window.addEventListener('scroll', activateNavOnScroll);  

// ===========================  
// Smooth Scroll  
// ===========================  
document.querySelectorAll('a[href^="#"]').forEach(anchor => {  
    anchor.addEventListener('click', function (e) {  
        e.preventDefault();  
        const targetId = this.getAttribute('href');  
        
        if (targetId === '#') return;  
        
        const targetSection = document.querySelector(targetId);  
        
        if (targetSection) {  
            window.scrollTo({  
                top: targetSection.offsetTop - 80,  
                behavior: 'smooth'  
            });  
        }  
    });  
});  

// ===========================  
// Back to Top Button  
// ===========================  
window.addEventListener('scroll', () => {  
    if (window.scrollY > 400) {  
        backToTop.classList.add('show');  
    } else {  
        backToTop.classList.remove('show');  
    }  
});  

backToTop.addEventListener('click', () => {  
    window.scrollTo({  
        top: 0,  
        behavior: 'smooth'  
    });  
});  

// ===========================  
// Set Minimum Date for Appointment  
// ===========================  
const visitDate = document.getElementById('visitDate');  
if (visitDate) {  
    const today = new Date();  
    const tomorrow = new Date(today);  
    tomorrow.setDate(tomorrow.getDate() + 1);  
    
    const minDate = tomorrow.toISOString().split('T')[0];  
    visitDate.setAttribute('min', minDate);  
}  

// ===========================  
// Form Validation & Submission  
// ===========================  
appointmentForm.addEventListener('submit', async (e) => {  
    e.preventDefault();  

    // Get form data  
    const formData = {  
        patientName: document.getElementById('patientName').value.trim(),  
        patientPhone: document.getElementById('patientPhone').value.trim(),  
        patientEmail: document.getElementById('patientEmail').value.trim(),  
        visitDate: document.getElementById('visitDate').value,  
        visitTime: document.getElementById('visitTime').value,  
        serviceNeeded: document.getElementById('serviceNeeded').value,  
        patientMessage: document.getElementById('patientMessage').value.trim(),  
        timestamp: new Date().toISOString(),  
        status: 'pending'  
    };  

    // Validate phone number (Saudi format)  
    const phoneRegex = /^(05|5)[0-9]{8}$/;  
    if (!phoneRegex.test(formData.patientPhone.replace(/\s/g, ''))) {  
        showAlert('error', 'رقم الجوال غير صحيح. يرجى إدخال رقم سعودي صحيح');  
        return;  
    }  

    // Show loading state  
    const submitBtn = appointmentForm.querySelector('.submit-button');  
    const btnContent = submitBtn.querySelector('.btn-content');  
    const btnLoader = submitBtn.querySelector('.btn-loader');  

    submitBtn.disabled = true;  
    btnContent.style.display = 'none';  
    btnLoader.style.display = 'flex';  

    try {  
        // Simulate API call (يمكنك استبداله بـ API حقيقي)  
        await sendAppointmentRequest(formData);  

        // Success  
        showAlert('success', `  
            ✅ تم إرسال طلب الحجز بنجاح!<br>  
            <strong>شكراً ${formData.patientName}</strong><br>  
            سنتواصل معك على رقم ${formData.patientPhone} خلال 24 
                    showAlert('success', `
            ✅ تم إرسال طلب الحجز بنجاح!<br>
            <strong>شكراً ${formData.patientName}</strong><br>
            سنتواصل معك على رقم ${formData.patientPhone} خلال 24 ساعة لتأكيد الموعد.
        `);

        // Save to localStorage
        saveAppointmentToLocalStorage(formData);

        // Reset form
        appointmentForm.reset();

        // Log to console
        console.log('✅ Appointment booked successfully:', formData);

        // Scroll to alert
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        // Error
        showAlert('error', `
            ❌ حدث خطأ أثناء إرسال الطلب<br>
            يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة على:<br>
            <strong>+966 50 123 4567</strong>
        `);

        console.error('❌ Error submitting appointment:', error);

    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnContent.style.display = 'flex';
        btnLoader.style.display = 'none';

        // Auto hide alert after 8 seconds
        setTimeout(() => {
            formAlert.style.display = 'none';
        }, 8000);
    }
});

// ===========================
// Show Alert Function
// ===========================
function showAlert(type, message) {
    formAlert.className = `form-alert ${type}`;
    formAlert.innerHTML = message;
    formAlert.style.display = 'block';
}

// ===========================
// Simulate Backend API Call
// ===========================
function sendAppointmentRequest(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // 97% success rate
            if (Math.random() > 0.03) {
                // يمكنك هنا إضافة Integration مع:
                // - EmailJS: https://www.emailjs.com
                // - Formspree: https://formspree.io
                // - Google Sheets API
                // - WhatsApp Business API
                // - أي Backend حقيقي (Node.js, PHP, Python, etc.)

                resolve({
                    success: true,
                    message: 'Appointment booked successfully',
                    appointmentId: generateAppointmentId(),
                    data: data
                });
            } else {
                reject({
                    success: false,
                    message: 'Server error occurred'
                });
            }
        }, 2500);
    });
}

// ===========================
// Generate Unique Appointment ID
// ===========================
function generateAppointmentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `DENT-${timestamp}-${random}`;
}

// ===========================
// Save to Local Storage
// ===========================
function saveAppointmentToLocalStorage(appointment) {
    try {
        // Get existing appointments
        let appointments = JSON.parse(localStorage.getItem('dentalAppointments')) || [];

        // Add appointment ID and creation date
        appointment.id = generateAppointmentId();
        appointment.createdAt = new Date().toISOString();

        // Add to array
        appointments.push(appointment);

        // Save back to localStorage
        localStorage.setItem('dentalAppointments', JSON.stringify(appointments));

        console.log('💾 Appointment saved to localStorage');
        console.log('📊 Total appointments:', appointments.length);

    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// ===========================
// Get All Appointments (للمسؤول)
// ===========================
function getAllAppointments() {
    try {
        const appointments = JSON.parse(localStorage.getItem('dentalAppointments')) || [];
        console.log('📋 All Appointments:');
        console.table(appointments);
        return appointments;
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        return [];
    }
}

// ===========================
// Clear All Appointments
// ===========================
function clearAllAppointments() {
    const confirmation = confirm('⚠️ هل أنت متأكد من حذف جميع المواعيد؟\nهذا الإجراء لا يمكن التراجع عنه!');
    
    if (confirmation) {
        localStorage.removeItem('dentalAppointments');
        console.log('🗑️ All appointments cleared successfully');
        alert('✅ تم حذف جميع المواعيد بنجاح');
    } else {
        console.log('❌ Clear operation cancelled');
    }
}

// ===========================
// Export Appointments to CSV
// ===========================
function exportAppointmentsToCSV() {
    try {
        const appointments = JSON.parse(localStorage.getItem('dentalAppointments')) || [];
        
        if (appointments.length === 0) {
            alert('لا توجد مواعيد لتصديرها');
            return;
        }

        // CSV Headers
        let csv = 'ID,الاسم,الجوال,البريد,التاريخ,الوقت,الخدمة,الحالة,تاريخ الإنشاء\n';

        // Add data rows
        appointments.forEach(apt => {
            csv += `"${apt.id}","${apt.patientName}","${apt.patientPhone}","${apt.patientEmail}","${apt.visitDate}","${apt.visitTime}","${apt.serviceNeeded}","${apt.status}","${apt.createdAt}"\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `dental-appointments-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('📥 Appointments exported to CSV successfully');
        alert('✅ تم تصدير المواعيد بنجاح');

    } catch (error) {
        console.error('Error exporting appointments:', error);
        alert('❌ حدث خطأ أثناء التصدير');
    }
}

// ===========================
// Search Appointments by Phone
// ===========================
function searchAppointmentByPhone(phoneNumber) {
    try {
        const appointments = JSON.parse(localStorage.getItem('dentalAppointments')) || [];
        const results = appointments.filter(apt => apt.patientPhone.includes(phoneNumber));
        
        if (results.length > 0) {
            console.log(`🔍 Found ${results.length} appointment(s) for ${phoneNumber}:`);
            console.table(results);
        } else {
            console.log(`❌ No appointments found for ${phoneNumber}`);
        }
        
        return results;
    } catch (error) {
        console.error('Error searching appointments:', error);
        return [];
    }
}

// ===========================
// Get Statistics
// ===========================
function getAppointmentStatistics() {
    try {
        const appointments = JSON.parse(localStorage.getItem('dentalAppointments')) || [];
        
        const stats = {
            total: appointments.length,
            pending: appointments.filter(apt => apt.status === 'pending').length,
            confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
            completed: appointments.filter(apt => apt.status === 'completed').length,
            cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
            services: {}
        };

        // Count appointments by service
        appointments.forEach(apt => {
            if (stats.services[apt.serviceNeeded]) {
                stats.services[apt.serviceNeeded]++;
            } else {
                stats.services[apt.serviceNeeded] = 1;
            }
        });

        console.log('📊 Appointment Statistics:');
        console.table(stats);
        
        return stats;
    } catch (error) {
        console.error('Error getting statistics:', error);
        return null;
    }
}

// ===========================
// Scroll Animations (Intersection Observer)
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .service-item,
        .gallery-box,
        .testimonial-box,
        .stat-box
    `);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// ===========================
// Lazy Load Images (للصور الحقيقية)
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===========================
// Number Counter Animation
// ===========================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Animate stat numbers when visible
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const number = entry.target.querySelector('h3');
            const targetValue = parseInt(number.textContent.replace(/[^0-9]/g, ''));
            
            animateCounter(number, targetValue);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-box').forEach(box => {
    statObserver.observe(box);
});

// ===========================
// Form Input Validation (Real-time)
// ===========================
const phoneInput = document.getElementById('patientPhone');
const emailInput = document.getElementById('patientEmail');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format: 05XX XXX XXXX
        if (value.length > 0) {
            if (value.length <= 4) {
                e.target.value = value;
            } else if (value.length <= 7) {
                e.target.value = value.slice(0, 4) + ' ' + value.slice(4);
            } else {
                e.target.value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 11);
            }
        }

        // Validate
        const cleanValue = value.replace(/\s/g, '');
        if (cleanValue.length === 10 && /^(05|5)[0-9]{8}$/.test(cleanValue)) {
            phoneInput.style.borderColor = '#22c55e';
        } else if (cleanValue.length > 0) {
            phoneInput.style.borderColor = '#ef4444';
        } else {
            phoneInput.style.borderColor = '#e2e8f0';
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', (e) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (e.target.value && emailRegex.test(e.target.value)) {
            emailInput.style.borderColor = '#22c55e';
        } else if (e.target.value) {
            emailInput.style.borderColor = '#ef4444';
        } else {
            emailInput.style.borderColor = '#e2e8f0';
        }
    });
}

// ===========================
// Prevent Form Resubmission
// ===========================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🦷 مرحباً بك في مركز التميز لطب الأسنان', 'font-size: 20px; font-weight: bold; color: #0ea5e9;');
console.log('%cللوصول إلى لوحة التحكم استخدم الدوال التالية:', 'font-size: 14px; color: #64748b;');
console.log('%c• getAllAppointments()', 'color: #22c55e; font-weight: bold;', '- عرض جميع المواعيد');
console.log('%c• searchAppointmentByPhone("05xxxxxxxx")', 'color: #22c55e; font-weight: bold;', '- البحث برقم الجوال');
console.log('%c• getAppointmentStatistics()', 'color: #22c55e; font-weight: bold;', '- عرض الإحصائيات');
console.log('%c• exportAppointmentsToCSV()', 'color: #22c55e; font-weight: bold;', '- تصدير إلى CSV');
console.log('%c• clearAllAppointments()', 'color: #ef4444; font-weight: bold;', '- ⚠️ حذف جميع المواعيد');

// ===========================
// Performance Monitoring
// ===========================
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
    
    // Log navigation timing
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`📊 Total page load time: ${pageLoadTime}ms`);
    }
});

// ===========================
// Error Handling
// ===========================
window.addEventListener('error', (e) => {
    console.error('❌ Global Error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});

// ===========================
// Keyboard Shortcuts (للمطورين)
// ===========================
document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + A = Show all appointments
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        getAllAppointments();
    }
    
    // Ctrl + Shift + S = Show statistics
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        getAppointmentStatistics();
    }
    
    // Ctrl + Shift + E = Export to CSV
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        exportAppointmentsToCSV();
    }
});

// ===========================
// Service Worker Registration (PWA)
// ===========================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// ===========================
// Online/Offline Detection
// ===========================
window.addEventListener('online', () => {
    console.log('✅ Connection restored');
    showAlert('success', '✅ تم استعادة الاتصال بالإنترنت');
});

window.addEventListener('offline', () => {
    console.log('❌ Connection lost');
    showAlert('error', '❌ تم فقدان الاتصال بالإنترنت<br>يرجى التحقق من اتصالك');
});

// ===========================
// Browser Compatibility Check
// ===========================
function checkBrowserCompatibility() {
    const isIE = /MSIE|Trident/.test(navigator.userAgent);
    
    if (isIE) {
        alert('⚠️ المتصفح الذي تستخدمه قديم وقد لا يعمل الموقع بشكل صحيح. يرجى استخدام متصفح حديث مثل Chrome أو Firefox أو Edge.');
        console.warn('⚠️ Internet Explorer detected - Limited support');
    }
}

checkBrowserCompatibility();

// ===========================
// Initialize
// ===========================
console.log('✅ Script initialized successfully');
console.log('📱 Device:', /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop');
console.log('🌐 Browser:', navigator.userAgent.split(' ').pop());
