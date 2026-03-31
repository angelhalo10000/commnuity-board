# AI Coding Guidelines for 電子自治会アプリ

## Architecture Overview
- **Backend**: Ruby on Rails API mode for RESTful endpoints
- **Frontend**: React + Vite with responsive design (mobile/PC/tablet)
- **Authentication**: Dual system - common password for members, individual email/password for president (admin)
- **Data Flow**: Frontend fetches from Rails API, file uploads handled via attachments

## Key Models & Relationships
- `organizations` (自治会): Contains `member_password_digest` for common auth
- `blocks` (班): 8 groups with sort_order
- `admin_users` (会長): Email/password auth
- `notices` (お知らせ): Title, body, attachments, target_type (all/blocks), status (draft/published)
- `circulars` (回覧板): Title, file_url (PDF/image), target_type, status
- Target relationships: `notice_targets`, `circular_targets` for block-specific delivery

## Authentication Patterns
- Unauthenticated users redirected to `/enter` for common password
- Session-based auth for members, persists across visits
- Admin login at `/admin/login` with email/password, bcrypt hashing
- Reference: `mockups/enter.html`, `mockups/admin_login.html`

## UI/UX Conventions
- Minimum font size 14px for accessibility (elderly users)
- CSS variables for colors: `--primary: #2563eb`, `--bg: #f8fafc`
- Card-based layout with shadows: `box-shadow: var(--shadow)`
- Responsive grid: `grid-template-columns: 1fr 1fr` on desktop, `1fr` on mobile
- Reference: `mockups/style.css`, `mockups/index.html`

## File Handling
- Attachments: Max 10MB per file, stored as URLs
- Circulars: Inline PDF/image viewer (reference `mockups/file_viewer.html`)
- Upload forms: Title + file input, target selection (all/blocks)

## Development Workflow
- Build frontend: `npm run dev` (Vite)
- Rails API: Standard Rails commands (`rails s`, `rails db:migrate`)
- HTTPS required in production
- Browser support: Safari, Chrome, Firefox (latest 2 versions)

## Project-Specific Patterns
- Target filtering: Use `target_type` enum ('all' or 'blocks') with join tables for specific delivery
- Status management: Notices have draft/scheduled/published/archived states
- Search: Date-based (month/year) + keyword full-text on title/body
- "New" badge: Show for notices published within 30 days
- Reference: `requirements.md` for full specs, `TODO.md` for pending decisions

## Code Organization
- Frontend components in React, API calls to Rails endpoints
- Admin routes prefixed with `/admin/`
- Public routes: `/`, `/notices`, `/circulars`, `/enter`
- Mockups in `mockups/` directory exemplify final UI structure</content>
<parameter name="filePath">/Users/kazz/Projects/claude_sample/.github/copilot-instructions.md