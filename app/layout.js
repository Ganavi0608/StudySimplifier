import './styles/globals.css';

export const metadata = {
  title: 'StudySimplify',
  description: 'Smart study tool for college students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
