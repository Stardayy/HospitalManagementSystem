# 🏥 Hospital Management System (WellNest)

Một hệ thống quản lý bệnh viện Full-stack hoàn chỉnh, bao gồm quản lý hồ sơ bệnh nhân, lịch trình bác sĩ, cuộc hẹn và báo cáo tài chính. Dự án sử dụng kiến trúc tách biệt Frontend (React) và Backend (Spring Boot).

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🏗 Cấu Trúc Dự Án (Project Structure)

Dự án được tổ chức theo mô hình Monorepo (2 project con nằm chung 1 thư mục cha):

```text
Hospital-Management-System/
├── backend/                  # Spring Boot Application (Server)
│   ├── src/main/java/com/hms # Mã nguồn Java
│   │   ├── config/           # Cấu hình (CORS, Security)
│   │   ├── controller/       # API Endpoints
│   │   ├── model/            # Data Models (Entities)
│   │   └── repository/       # Database Interaction
│   ├── src/main/resources    # Cấu hình Database (application.properties)
│   └── pom.xml               # Quản lý thư viện Maven
│
├── frontend/                 # React Application (Client)
│   ├── src/
│   │   ├── api/              # Cấu hình gọi API (Axios/Fetch)
│   │   ├── components/       # Các thành phần UI (Sidebar, Card...)
│   │   ├── pages/            # Các trang chính (Dashboard...)
│   │   └── styles/           # CSS Styling
│   ├── package.json          # Quản lý thư viện NPM
│   └── vite.config.js        # Cấu hình Vite
│
└── README.md                 # Tài liệu hướng dẫn này
🛠 Công Nghệ Sử Dụng (Tech Stack)FrontendFramework: React 19 + ViteNgôn ngữ: JavaScript (ES6+) / JSXThư viện chính:recharts: Vẽ biểu đồ thống kê.react-calendar: Lịch làm việc.react-icons: Bộ icon nhẹ.fetch API: Kết nối Backend.BackendFramework: Spring Boot 3.5.8Ngôn ngữ: Java 17Database: MySQLBuild Tool: MavenKiến trúc: RESTful API⚙️ Yêu Cầu Cài Đặt (Prerequisites)Trước khi chạy, hãy đảm bảo máy bạn đã cài:Node.js (v18 trở lên) & npm.Java JDK (v17 trở lên).MySQL Server (đang chạy ở cổng 3306).🚀 Hướng Dẫn Cài Đặt & Chạy (Setup Guide)Bước 1: Cấu hình Database (MySQL)Mở MySQL Workbench hoặc Terminal và chạy lệnh sau để tạo Database:SQLCREATE DATABASE hospital_management_system;
Lưu ý: Backend đang được cấu hình mặc định với user root và password 1234. Nếu máy bạn khác, hãy sửa file backend/src/main/resources/application.properties.Bước 2: Chạy Backend (Spring Boot)Backend sẽ chạy tại http://localhost:8080.Mở Terminal (Dòng lệnh) tại thư mục backend.Chạy lệnh khởi động:Bash# Windows
./mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
🔑 Cấu hình quan trọng trong BackendFile CorsConfig.java đã được thiết lập để cho phép React truy cập:Java// Đường dẫn: backend/src/main/java/com/hms/hospital_management_system/config/CorsConfig.java
registry.addMapping("/**")
        .allowedOrigins("http://localhost:5173") // Cho phép Frontend
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowCredentials(true);
Bước 3: Chạy Frontend (React)Frontend sẽ chạy tại http://localhost:5173.Mở một Terminal mới (giữ Terminal backend đang chạy).Di chuyển vào thư mục frontend: cd frontend.Cài đặt thư viện (chỉ làm lần đầu):Bashnpm install
Chạy dự án:Bashnpm run dev
🔌 Cấu hình kết nối APIFile api.js giúp Frontend nói chuyện với Backend:JavaScript// Đường dẫn: frontend/src/api/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  get: (endpoint) => fetchApi(endpoint, { method: 'GET' }),
  // ... các hàm post, put, delete
};
🧪 Kiểm Tra Kết Nối (Testing)Mở trình duyệt truy cập: http://localhost:5173.Nếu Dashboard hiện ra với các biểu đồ -> Frontend chạy tốt.Nếu dữ liệu trên Dashboard là dữ liệu thật từ Database (không phải MockData) -> Kết nối Full-stack thành công.Để test riêng API Backend, truy cập: http://localhost:8080/api/hello (nếu đã tạo TestController).🐛 Khắc phục lỗi thường gặp (Troubleshooting)LỗiNguyên nhân & Cách sửaCORS Error (trên browser console)Backend chưa cho phép cổng 5173 truy cập. Kiểm tra lại file CorsConfig.java trong Backend.Connection RefusedBackend chưa chạy hoặc MySQL chưa bật. Hãy đảm bảo chạy Backend trước.npm run dev lỗiChưa cài node_modules. Chạy lại lệnh npm install trong thư mục frontend.Recharts / React-icons not foundThiếu thư viện Frontend. Chạy: npm install recharts react-icons react-calendar.🤝 Đóng Góp (Contributing)Fork dự án.Tạo nhánh tính năng (git checkout -b feature/NewFeature).Commit thay đổi (git commit -m 'Add new feature').Push lên nhánh (git push origin feature/NewFeature).Tạo Pull Request.© 2025 WellNest Hospital Management System