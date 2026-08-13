import './global.css';

export const metadata = {
  title: 'CerebroPlay',
  description: 'Train the skills you use every day.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
