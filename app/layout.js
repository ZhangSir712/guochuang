import './globals.css'

export const metadata = {
  title: '宠智灵境 - AI驱动的数字宠物与情感疗愈平台',
  description: '通过AI技术为失去宠物的用户提供数字生命复刻与情感慰藉',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}