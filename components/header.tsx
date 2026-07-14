import { Box, Tabs, Text } from '@bigcommerce/big-design'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGqlCheck } from '../lib/hooks'
import InnerHeader from './innerHeader'

export const TabIds = {
  HOME: 'home',
  PLANS: 'plans',
  PRODUCTS: 'products',
  CHECKOUTS: 'checkouts',
  DOCS: 'docs',
}

export const TabRoutes = {
  [TabIds.HOME]: '/',
  [TabIds.PLANS]: '/plans',
  [TabIds.PRODUCTS]: '/products',
  [TabIds.CHECKOUTS]: '/checkouts',
  [TabIds.DOCS]: '/docs',
}

const HeaderlessRoutes = [
  '/orders/[orderId]',
  '/orders/[orderId]/labels',
  '/orders/[orderId]/modal',
  '/productAppExtension/[productId]',
]

const InnerRoutes = ['/products/[pid]']

const HeaderTypes = {
  GLOBAL: 'global',
  INNER: 'inner',
  HEADERLESS: 'headerless',
}

const dotColor = { ok: '#3d9970', error: '#e84040', checking: '#aaaaaa' }
const dotLabel = {
  ok: 'BigCommerce API connected',
  error: 'BigCommerce API unreachable',
  checking: 'Checking BigCommerce API…',
}

const Header = () => {
  const [activeTab, setActiveTab] = useState<string>('')
  const [flipping, setFlipping] = useState(false)
  const { status } = useGqlCheck()
  const [headerType, setHeaderType] = useState<string>(HeaderTypes.GLOBAL)
  const router = useRouter()
  const { pathname } = router

  useEffect(() => {
    if (InnerRoutes.includes(pathname)) {
      setHeaderType(HeaderTypes.INNER)
    } else if (HeaderlessRoutes.includes(pathname)) {
      setHeaderType(HeaderTypes.HEADERLESS)
    } else {
      const tabKey = Object.keys(TabRoutes).find(
        (key) => TabRoutes[key] === pathname
      )
      setActiveTab(tabKey ?? '')
      setHeaderType(HeaderTypes.GLOBAL)
    }
  }, [pathname])

  useEffect(() => {
    router.prefetch('/products')
    router.prefetch('/plans')
    router.prefetch('/checkouts')
    router.prefetch('/docs')
  })

  const items = [
    { ariaControls: 'home', id: TabIds.HOME, title: 'Home' },
    { ariaControls: 'products', id: TabIds.PRODUCTS, title: 'Products' },
    { ariaControls: 'plans', id: TabIds.PLANS, title: 'Plans' },
    { ariaControls: 'checkouts', id: TabIds.CHECKOUTS, title: 'Checkouts' },
    { ariaControls: 'docs', id: TabIds.DOCS, title: 'Docs' },
  ]

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)

    return router.push(TabRoutes[tabId])
  }

  if (headerType === HeaderTypes.HEADERLESS) return null
  if (headerType === HeaderTypes.INNER) return <InnerHeader />

  return (
    <HeaderWrapper marginBottom="xxLarge">
      <Tabs activeTab={activeTab} items={items} onTabClick={handleTabClick} />
      <LogoCircle
        $flipping={flipping}
        onClick={() => setFlipping(true)}
        onAnimationEnd={() => setFlipping(false)}
      >
        <LogoInner>
          <BlobfishLogo src="/blobfish.png" alt="Blobfish" />
        </LogoInner>
      </LogoCircle>
      <StatusBadge>
        <Dot color={dotColor[status]} />
        <Text marginBottom="none">{dotLabel[status]}</Text>
      </StatusBadge>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled(Box)`
  position: relative;
`

const LogoCircle = styled.div<{ $flipping: boolean }>`
  position: absolute;
  top: -1.3rem;
  left: calc(50% - 36px);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 3px;
  background: conic-gradient(
    from 200deg,
    #707070,
    #c0c0c0,
    #ffffff 30%,
    #c0c0c0,
    #808080,
    #707070
  );
  cursor: pointer;
  perspective: 400px;
  ${({ $flipping }) => $flipping && `animation: coinFlip 0.6s ease-in-out;`}

  @keyframes coinFlip {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
`

const LogoInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 200deg,
    #5a5a5a,
    #b0b0b0,
    #f0f0f0 30%,
    #b0b0b0,
    #686868,
    #5a5a5a
  );
  display: flex;
  align-items: center;
  justify-content: center;
`

const BlobfishLogo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`

const StatusBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
`

const Dot = styled.span<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.color};
  margin-right: 8px;
  flex-shrink: 0;
`

export default Header
