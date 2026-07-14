export interface Plan {
  id: string
  name: string
  description: string
  price: number
  interval: 'MONTH'
  productLevel: string
  features: string[]
  recommended?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'barefin',
    name: 'Barefin',
    description: 'Just a fish. No ambitions.',
    price: 0,
    interval: 'MONTH',
    productLevel: 'barefin',
    features: [
      'One blobfish, no accessories',
      'Looks exactly how you feel on Mondays',
      'Non-commercial despair only',
    ],
  },
  {
    id: 'clipon',
    name: 'Clip-On',
    description: 'The tie is real. The confidence less so.',
    price: 9,
    interval: 'MONTH',
    productLevel: 'clipon',
    features: [
      'Everything in Barefin',
      'Blobfish gets a tie (clip-on)',
      'Slightly less sad expression',
      'Up to 3 blobfish per store',
    ],
  },
  {
    id: 'fedora',
    name: 'Fedora',
    description: 'Hat. Tie. Means business.',
    price: 29,
    interval: 'MONTH',
    productLevel: 'fedora',
    features: [
      'Everything in Clip-On',
      'Blobfish gets a real tie (knotted)',
      'Pink fedora included',
      'Animated blobfish (wobble, float, despair)',
      'Unlimited blobfish per store',
    ],
    recommended: true,
  },
  {
    id: 'stache',
    name: 'The Stache',
    description: 'The mustache is real. So is the invoice.',
    price: 99,
    interval: 'MONTH',
    productLevel: 'stache',
    features: [
      'Everything in Fedora',
      'Blobfish gets a mustache (real)',
      'Custom expressions (smug, anguished, closing deal)',
      'White-label blobfish (your brand, our fish)',
      'Dedicated blobfish account manager',
    ],
  },
]
