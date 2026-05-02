export const metadata = {
  title: 'Divine Elite Bridge',
  description: 'Secure RCON Gateway',
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
