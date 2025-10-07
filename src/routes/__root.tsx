import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner.tsx'
import MobileBar from '@/components/user-bar/MobileBar.tsx'
import UserBar from '@/components/user-bar/UserBar.tsx'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Karaoke Match - What songs do you and your friends Love?' },
      {
        name: 'description',
        content:
          'Karaoke Match lets you build your a track of your absolute favorite karaoke songs (bangers), invite your friends to a group and see what songs two or more of you love!',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-svh">
          <UserBar />
          {/*<Suspense fallback={null}>
						<MobileBar />
					</Suspense>*/}
          <main>{children}</main>
          <Toaster />
        </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
