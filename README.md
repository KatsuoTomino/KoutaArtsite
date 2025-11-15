# Kouta Artworld Portfolio

A modern portfolio website built with Next.js and Supabase, featuring an elegant puzzle-piece animation for the hero image and a powerful admin panel for content management.

## ✨ Features

- **Dynamic Content Management**: Manage works and news items through an admin panel
- **Supabase Integration**: Backend powered by Supabase for authentication, database, and storage
- **Responsive Design**: Mobile-first design with smooth animations using Framer Motion
- **Image Optimization**: Next.js Image component for optimized image loading
- **Puzzle Animation**: Unique puzzle-piece animation for the hero image
- **Admin Authentication**: Secure admin panel with Supabase authentication

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, Auth)
- **Deployment**: [Vercel](https://vercel.com/)
- **Language**: TypeScript

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/KatsuoTomino/KoutaArtsite.git
cd portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Set up Supabase**

Follow the instructions in [SUPABASE_SETUP_COMPLETE.md](./SUPABASE_SETUP_COMPLETE.md) to:

- Create the database tables
- Set up storage buckets
- Configure Row Level Security (RLS) policies
- Create an admin user

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## 🗂️ Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── works/[id]/        # Work detail pages
│   │   ├── news/[id]/         # News detail pages
│   │   └── admin/             # Admin panel
│   │       ├── login/         # Admin login
│   │       ├── works/         # Works management
│   │       └── news/          # News management
│   ├── components/            # React components
│   │   └── PuzzleImage.tsx   # Puzzle animation component
│   └── lib/                   # Utility functions
│       ├── supabase.ts        # Supabase client
│       └── auth.ts            # Authentication helpers
├── public/                    # Static assets
│   └── image/                 # Images
├── .env.local                 # Environment variables (not in git)
├── next.config.ts             # Next.js configuration
└── SUPABASE_SETUP_COMPLETE.md # Supabase setup guide
```

## 🔐 Admin Panel

Access the admin panel at `/admin/login` with your Supabase user credentials.

### Admin Features:

- **Works Management**: Add, edit, and delete artwork entries
- **News Management**: Create, update, and remove news items
- **Image Upload**: Upload images directly to Supabase Storage
- **Authentication**: Secure login with Supabase Auth

## 📝 Database Schema

### Works Table

- `id`: Primary key
- `title`: Work title
- `image_url`: Image URL from Supabase Storage
- `year`: Production year (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### News Table

- `id`: Primary key
- `date`: Publication date
- `title`: News title
- `description`: Short description
- `image_url`: Image URL from Supabase Storage (optional)
- `content`: Array of content paragraphs
- `category`: News category (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a personal portfolio project. Contributions are not currently accepted.

## 📧 Contact

For any inquiries, please contact: to.katufumi.629@gmail.com
