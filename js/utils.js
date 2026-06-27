/**
 * Atmos Dental – Shared Utilities (js/utils.js)
 *
 * Reusable modules extracted from duplicated patterns across the site.
 * Consumed by main.js to eliminate repetition.
 */

'use strict';

/* ============================================================
   ModalManager – Shared open/close/escape/scroll-lock logic
   ============================================================ */
var ModalManager = (function () {
  var activeModals = [];

  function open(cfg) {
    cfg.panels.forEach(function (panel) {
      panel.el.classList.add(panel.activeClass);
      panel.el.setAttribute('aria-hidden', 'false');
    });
    document.body.style.overflow = 'hidden';
    activeModals.push(cfg);
  }

  function close(cfg) {
    cfg.panels.forEach(function (panel) {
      panel.el.classList.remove(panel.activeClass);
      panel.el.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
    var idx = activeModals.indexOf(cfg);
    if (idx !== -1) activeModals.splice(idx, 1);
    if (cfg.onClose) cfg.onClose();
  }

  function handleEscape(e) {
    if (e.key === 'Escape' && activeModals.length) {
      close(activeModals[activeModals.length - 1]);
    }
  }

  document.addEventListener('keydown', handleEscape);

  return { open: open, close: close };
}());

/* ============================================================
   renderList – Data-driven DOM generation for repeated blocks
   ============================================================ */
function renderList(container, items, templateFn) {
  if (!container) return;
  var fragment = document.createDocumentFragment();
  items.forEach(function (item) {
    var html = templateFn(item);
    var temp = document.createElement('div');
    temp.innerHTML = html.trim();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
  });
  container.appendChild(fragment);
}

/* ============================================================
   SVG Icons – Single source of truth for repeated SVG markup
   ============================================================ */
var SvgIcons = {
  whatsapp: function (size) {
    size = size || 24;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>' +
      '<path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 01-4.049-1.106l-.29-.172-3.005.788.803-2.929-.19-.301A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>' +
      '</svg>';
  },

  logo: function (size, variant) {
    size = size || 40;
    var circleStroke = variant === 'footer' ? '#00C9A7' : '#0077CC';
    var circleFill = variant === 'footer' ? '#7FEFDC' : '#0077CC';
    var toothStroke = variant === 'footer' ? '#7FEFDC' : '#0077CC';
    return '<svg class="logo-icon" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M 10 50 Q 25 30 40 50 T 70 50" stroke="#00C9A7" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<circle cx="60" cy="60" r="35" fill="' + circleFill + '" opacity="0.15" stroke="' + circleStroke + '" stroke-width="2"/>' +
      '<g transform="translate(38, 45)">' +
      '<path d="M 22 5 C 18 5 15 8 15 14 C 15 22 18 28 22 32 C 26 28 29 22 29 14 C 29 8 26 5 22 5 Z" fill="white" stroke="' + toothStroke + '" stroke-width="1"/>' +
      '<ellipse cx="20" cy="12" rx="3" ry="5" fill="#E8F4FD" opacity="0.8"/>' +
      '</g></svg>';
  }
};

/* ============================================================
   Site Data – Centralized content for repeated sections
   ============================================================ */
var SiteData = {
  services: [
    {
      title: 'General Dentistry',
      desc: 'Comprehensive check-ups, cleanings, fillings, and preventive care to keep your teeth strong and healthy year-round.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E8F4FD"/><path d="M20 8c-5 0-9 3.6-9 8 0 2.8 1.5 5.3 3.8 6.8L14 32h12l-.8-9.2C27.5 21.3 29 18.8 29 16c0-4.4-4-8-9-8z" fill="#0077CC"/><rect x="17" y="28" width="6" height="5" rx="1" fill="#00C9A7"/></svg>'
    },
    {
      title: 'Teeth Whitening',
      desc: 'Professional-grade whitening treatments that safely brighten your smile by several shades in just one visit.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E0FBF5"/><path d="M12 22c0 4.4 3.6 8 8 8s8-3.6 8-8V15H12v7z" fill="#00C9A7"/><rect x="10" y="12" width="20" height="5" rx="2" fill="#0077CC"/><path d="M27 9l2 2-2 2M13 9l-2 2 2 2" stroke="#0077CC" stroke-width="1.5" stroke-linecap="round"/></svg>'
    },
    {
      title: 'Orthodontics / Braces',
      desc: 'Metal braces, ceramic braces, and clear aligner solutions to straighten misaligned teeth at any age.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E8F4FD"/><rect x="10" y="18" width="20" height="4" rx="2" fill="#0077CC"/><circle cx="14" cy="20" r="3" fill="white" stroke="#0077CC" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="white" stroke="#0077CC" stroke-width="1.5"/><circle cx="26" cy="20" r="3" fill="white" stroke="#0077CC" stroke-width="1.5"/></svg>'
    },
    {
      title: 'Dental Implants',
      desc: 'Permanent, natural-looking tooth replacements that restore full chewing function and confidence in your smile.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E0FBF5"/><rect x="18" y="10" width="4" height="14" rx="2" fill="#0077CC"/><rect x="15" y="22" width="10" height="3" rx="1" fill="#00C9A7"/><ellipse cx="20" cy="30" rx="5" ry="3" fill="#0077CC" opacity="0.3"/></svg>'
    },
    {
      title: 'Root Canal Treatment',
      desc: 'Gentle, effective root canal procedures to save infected teeth and eliminate pain with minimal discomfort.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E8F4FD"/><path d="M20 10c-4 0-7 3-7 7 0 2.5 1 4.5 2.5 5.5L15 30h10l-.5-7.5c1.5-1 2.5-3 2.5-5.5 0-4-3-7-7-7z" fill="#0077CC" opacity="0.7"/><line x1="20" y1="15" x2="20" y2="28" stroke="#00C9A7" stroke-width="1.5" stroke-dasharray="2 2"/></svg>'
    },
    {
      title: 'Smile Designing',
      desc: 'Comprehensive aesthetic smile makeovers designed to enhance your natural beauty and boost your confidence.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E0FBF5"/><path d="M12 20c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="#0077CC" stroke-width="2" fill="none"/><circle cx="15" cy="18" r="2" fill="#00C9A7"/><circle cx="25" cy="18" r="2" fill="#00C9A7"/><path d="M16 23 Q20 27 24 23" stroke="#0077CC" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      title: 'Kids Dentistry',
      desc: 'Child-friendly dental care in a fun, stress-free environment to build positive dental habits from an early age.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#E8F4FD"/><path d="M20 10c-3 0-5.5 2-5.5 5.5 0 2 0.8 3.7 2 4.8L16 30h8l-.5-9.7c1.2-1.1 2-2.8 2-4.8C25.5 12 23 10 20 10z" fill="#0077CC" opacity="0.6"/><circle cx="20" cy="33" r="2" fill="#00C9A7"/></svg>'
    },
    {
      title: 'Emergency Dental Care',
      desc: 'Prompt same-day treatment for toothaches, broken teeth, lost fillings, and all urgent dental emergencies.',
      icon: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FFE8E8"/><rect x="18" y="10" width="4" height="12" rx="2" fill="#CC2200"/><rect x="14" y="18" width="12" height="4" rx="2" fill="#CC2200"/></svg>'
    }
  ],

  gallery: [
    { label: 'Before & After', bg: 'linear-gradient(135deg,#0077CC,#00C9A7)', classes: 'gallery-item--tall' },
    { label: 'Teeth Whitening', bg: 'linear-gradient(135deg,#00C9A7,#7FEFDC)', classes: '' },
    { label: 'Orthodontics', bg: 'linear-gradient(135deg,#1A2B4A,#0077CC)', classes: '' },
    { label: 'Dental Implants', bg: 'linear-gradient(135deg,#004A8F,#00C9A7)', classes: 'gallery-item--wide' },
    { label: 'Smile Makeover', bg: 'linear-gradient(135deg,#00C9A7,#0077CC)', classes: '' },
    { label: 'Veneers', bg: 'linear-gradient(135deg,#5BC0F8,#0077CC)', classes: '' },
    { label: 'Kids Dentistry', bg: 'linear-gradient(135deg,#FFD166,#FF6B6B)', classes: '' },
    { label: 'Our Clinic', bg: 'linear-gradient(135deg,#1A2B4A,#004A8F)', classes: 'gallery-item--tall' },
    { label: 'Root Canal Care', bg: 'linear-gradient(135deg,#43B89C,#005F73)', classes: '' }
  ],

  testimonials: [
    {
      name: 'Priya Rajan',
      title: 'Software Engineer, Chennai',
      initials: 'PR',
      avatarBg: 'linear-gradient(135deg,#0077CC,#00C9A7)',
      quote: 'I had severe dental anxiety but the Atmos team made me feel completely at ease. My root canal was painless and the staff was incredibly compassionate throughout.'
    },
    {
      name: 'Karthik Sundaram',
      title: 'Business Owner, Chennai',
      initials: 'KS',
      avatarBg: 'linear-gradient(135deg,#1A2B4A,#0077CC)',
      quote: 'My daughter\'s braces treatment has been exceptional. Dr. Mohammed is brilliant with kids \u2014 he always explains everything clearly and makes it comfortable. Highly recommend!'
    },
    {
      name: 'Meera Nair',
      title: 'Marketing Manager, T. Nagar',
      initials: 'MN',
      avatarBg: 'linear-gradient(135deg,#00C9A7,#005F73)',
      quote: 'The teeth whitening results were beyond my expectations! I went four shades brighter in one session. The clinic is spotlessly clean and the technology is top-notch.'
    },
    {
      name: 'Arjun Venkat',
      title: 'Architect, Adyar',
      initials: 'AV',
      avatarBg: 'linear-gradient(135deg,#FF6B6B,#CC2200)',
      quote: 'Got dental implants here after losing a tooth in an accident. The whole process was smooth and the implant looks completely natural. Worth every rupee \u2014 absolute life-changer!'
    },
    {
      name: 'Divya Krishnamurthy',
      title: 'Teacher, Mogappair',
      initials: 'DK',
      avatarBg: 'linear-gradient(135deg,#5BC0F8,#0077CC)',
      quote: 'I\'ve been coming to Atmos Dental for three years. They remember every detail about my dental history and always provide personalised care. This is what a great dental practice looks like!'
    }
  ],

  contactItems: [
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077CC" stroke-width="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      label: 'Address',
      value: 'Dental Clinic,<br>Chennai, Tamil Nadu',
      href: null
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077CC" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>',
      label: 'Phone',
      value: '+91 90254 08659',
      href: 'tel:+919025408659'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 01-4.049-1.106l-.29-.172-3.005.788.803-2.929-.19-.301A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>',
      label: 'WhatsApp',
      value: 'Chat on WhatsApp',
      href: 'https://wa.me/919025408659',
      external: true
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077CC" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      label: 'Email',
      value: 'atmosdental@gmail.com',
      href: 'mailto:atmosdental@gmail.com'
    },
    {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0077CC" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
      label: 'Clinic Hours',
      value: 'Mon \u2013 Sat: 9:00 AM \u2013 8:00 PM<br>Sunday: 10:00 AM \u2013 6:00 PM',
      href: null
    }
  ]
};

/* ============================================================
   Template functions – Generate HTML from data
   ============================================================ */
var Templates = {
  serviceCard: function (item) {
    return '<article class="service-card fade-in" aria-label="' + item.title + '">' +
      '<div class="service-icon" aria-hidden="true">' + item.icon + '</div>' +
      '<h3 class="service-title">' + item.title + '</h3>' +
      '<p class="service-desc">' + item.desc + '</p>' +
      '</article>';
  },

  galleryItem: function (item) {
    var cls = 'gallery-item' + (item.classes ? ' ' + item.classes : '');
    return '<button class="' + cls + '" role="listitem" aria-label="View ' + item.label + ' result" data-label="' + item.label + '">' +
      '<div class="gallery-bg" style="background: ' + item.bg + ';"></div>' +
      '<span class="gallery-label">' + item.label + '</span>' +
      '</button>';
  },

  testimonialCard: function (item) {
    return '<article class="testimonial-card" aria-label="Testimonial from ' + item.name + '">' +
      '<div class="stars" aria-label="5 out of 5 stars">\u2605\u2605\u2605\u2605\u2605</div>' +
      '<blockquote class="testimonial-quote">\u201C' + item.quote + '\u201D</blockquote>' +
      '<div class="testimonial-author">' +
      '<div class="author-avatar" style="background:' + item.avatarBg + ';" aria-hidden="true">' + item.initials + '</div>' +
      '<div><p class="author-name">' + item.name + '</p>' +
      '<p class="author-title">' + item.title + '</p></div>' +
      '</div></article>';
  },

  contactItem: function (item) {
    var valueHtml;
    if (item.href) {
      var extra = item.external ? ' target="_blank" rel="noopener"' : '';
      valueHtml = '<a href="' + item.href + '" class="contact-value contact-link"' + extra + '>' + item.value + '</a>';
    } else {
      valueHtml = '<p class="contact-value">' + item.value + '</p>';
    }
    return '<div class="contact-item">' +
      '<div class="contact-icon" aria-hidden="true">' + item.icon + '</div>' +
      '<div><p class="contact-label">' + item.label + '</p>' + valueHtml + '</div>' +
      '</div>';
  }
};
