# PayrollPro - Digital Payslip Management System

A modern, enterprise-grade payroll management system with 3D interactive visualizations, built with HTML, CSS (Tailwind), and Three.js.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly on desktop, tablet, and mobile devices
- **Interactive 3D Animations**:
  - Kawaii robot mascot with jetpack in the Digital Payslip Management section
  - iPhone 17 Pro Max mockup with interactive 3D rotation and drag controls
- **Dark Mode Support**: Complete dark/light mode toggle with smooth transitions
- **NBC Compliant**: Payroll calculations following NBC (National Bank of Cambodia) standards
- **Modern UI/UX**: Clean, professional interface with smooth animations and transitions

## Pages

1. **index.html** - Landing page with features showcase and 3D robot animation
2. **payslip.html** - Interactive payslip form with 3D iPhone mockup
3. **calculations.html** - Detailed calculation methodology and formulas

## Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework via CDN
- **Three.js (r128)** - 3D graphics and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Google Fonts** - Inter font family

## Live Demo

Visit the live site: [Your GitHub Pages URL]

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/payrollpro.git
cd payrollpro
```

2. Open in browser:
```bash
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

## GitHub Pages Deployment

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select source: Deploy from branch
   - Select branch: main
   - Select folder: / (root)
   - Click Save

3. Your site will be live at: `https://yourusername.github.io/payrollpro/`

## Mobile Optimization

The site is fully optimized for mobile devices with:
- Responsive viewport meta tags
- Touch-friendly button sizes (minimum 44x44px)
- Mobile-specific CSS media queries
- Optimized 3D canvas sizes for different screen sizes
- iOS safe area support
- Landscape orientation handling

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Project Structure

```
payrollpro/
├── index.html              # Main landing page
├── payslip.html           # Payslip form page
├── calculations.html      # Calculation methodology
├── style.css             # Custom CSS styles
├── 3d-animations.js      # Kawaii robot 3D animation
├── payslip-3d-phone.js   # iPhone 3D mockup
└── README.md             # This file
```

## Credits

- **Three.js** - 3D graphics library
- **Tailwind CSS** - CSS framework
- **Lucide Icons** - Icon set

## License

MIT License - feel free to use this project for educational purposes.

## Author

SETECU Web Development Project - Midterm

---

**Note**: This is a school project for educational purposes.
