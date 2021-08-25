import tokens from 'constants/tokens'

const TOKEN_IDO = {
  lpdi: {
    symbol: 'LPDi',
    address: '0x32a6bD9800276be19050bd97459A7a36B26bD899',
    decimals: 18,
  },
  gdt: {
    symbol: 'GDT',
    address: '0x865Fa6A9DeE299De618A06729DC9e5f7d02055E3',
    decimals: 18,
  },
}

const configLands = [
  {
    idoId: 2,
    name: 'GetDone',
    stakingToken: tokens.dragon,
    buyToken: tokens.kai,
    slug: 'getdone',
    isFinished: false,
    img: '/icon/getdone.png',
    token: TOKEN_IDO.gdt,
    date: 1629028800000,
    content:
      'Decentralized Job Marketplace for Global Freelancers. Getdone is A Platform for Hiring Trusted Blockchain Talents. All freelancers on Getdone are chosen in the strict process to ensure that they are experienced or experts in blockchain industry.',
    detail: {
      description: [
        'Getdone is a blockchain-based platform connects global trusted-freelancers to clients with fair, transparent, effectiveness and benefits to members.',
        'Getdone is an all-in-one application that provides a wide range of AI & Blockchain freelance fields so that client could find for taking their jobs from developer, technician, translator, copywriter, designer, marketer, community builder…',
        'Get heritage from freelancerViet, Getdone has a steady background and over 700,000 users for creating traction right after launching. All of investors could join to freelancerViet.vn for more experience about our project',
        'Besides that, Getdone aims to build our ecosystem for our freelancer, clients and business partners all over the world. In Vietnam, we’ve worked to cooperate with local partners who are co-working space, coffee shop chain and learning center… for providing added value to our members in freelancerViet platform. We will open worldwide partners for the universal members.',
      ],
      links: [
        {
          label: 'Contact us via social media channels here',
        },
        {
          label: 'Facebook',
          url: 'https://www.facebook.com/getdone.co',
        },
        {
          label: 'Medium',
          url: 'https://medium.com/@getdone.co',
        },
        {
          label: 'Twitter',
          url: 'https://twitter.com/getdoneofficial',
        },
      ],
    },
    socialLink: [
      {
        title: 'Website',
        link: 'https://ido.getdone.co',
        src: '/icon/website-white.svg',
      },
      {
        title: 'Twitter',
        link: 'https://twitter.com/getdoneofficial',
        src: '/icon/twitter-white.svg',
      },
      {
        title: 'Telegram',
        link: 'https://t.me/getdoneofficial',
        src: '/icon/telegram-white.svg',
      },
    ],
    tokenInfo: {
      name: 'GetDone Token',
      symbol: TOKEN_IDO.gdt.symbol,
      totalSupply: 1000000000,
    },
    options: {
      labels: [
        {
          key: 'saleDate',
          text: 'Sale dates (UTC)',
        },
        {
          key: 'lockupRelease',
          text: 'Lockup & release',
        },
        {
          key: 'purchaseLimits',
          text: 'Purchase limits (KAI)',
        },
        {
          key: 'percentSupplyKai',
          text: '% of the Total supply (on Kai)',
        },
        {
          key: 'numberTokens',
          text: 'Number of Tokens',
        },
        {
          key: 'pricePerToken',
          text: 'Price per Token',
        },
        {
          key: 'listingPrice',
          text: 'DEX listing price',
        },
        {
          key: 'value',
          text: 'Value',
        },
        {
          key: 'minSlots',
          text: 'Min Slots',
        },
        {
          key: 'maxSlots',
          text: 'Max Slots',
        },
      ],
      data: [
        {
          index: 0,
          label: 'Details',
          poolContract: {
            address: '0xDF71FB2aD35CEC802f111cd48D5Cebb91722D6Fc',
            stakingRequire: 5000,
            stakingCount: 340,
          },
          idoContract: {
            address: '0xe27d5635126B690A66aD18F05ED9D419182C413e',
            openTime: 1629028800000,
            closeTime: 1629633600000,
            claimTime: 1629637200000,
            softCap: 80000,
            hardCap: 800000,
            totalSupply: 25000000,
            abiKey: 'ido1Abi',
          },
          unStakeTime: 1629720000000,
          buyTokenPrice: 0.032,
          minInvest: 4000,
          maxInvest: 8000,
          values: {
            saleDate: {
              dateOpen: 1629028800000,
              dateClose: 1629633600000,
            },
            lockupRelease: {
              text: 'Freely tradeable',
            },
            purchaseLimits: {
              text: '4,000 - 8,000',
            },
            percentSupplyKai: {
              number: 2.5,
              unit: '%',
              decimals: 1,
            },
            numberTokens: {
              number: 25000000,
            },
            pricePerToken: {
              unit: 'KAI',
              number: 0.032,
              decimals: 3,
            },
            listingPrice: {
              unit: 'KAI',
              number: 0.064,
              decimals: 3,
            },
            value: {
              number: 50000,
              prefix: '$',
            },
            minSlots: {
              number: 100,
            },
            maxSlots: {
              number: 200,
            },
          },
        },
      ],
    },
  },
  {
    idoId: 1,
    name: 'LPDI',
    stakingToken: tokens.dragon,
    buyToken: tokens.kai,
    isFinished: false,
    img: '/icon/logo-LDPi.png',
    token: TOKEN_IDO.lpdi,
    defaultSwapRate: {
      unit: 'KAI',
      price: 0.576923,
      decimals: 6,
    },
    content:
      'LPD Invest is a 100% Singapore-invested enterprise with a business license 202112208Z, raising capital from the financial market in Singapore and investing directly in LPD Vietnam in the fields of real estate and golf with growth potential, more than 300%/year in golf field.',
    detail: {
      description: [
        'LPD Invest is a 100% Singapore-invested enterprise investing directly into CitiGolf Vietnam. CitiGolf is a high-tech driving range chain with the strategy to open more than 40 courses around Vietnam up to 2025. As the first driving range is expected to commence in December 2021, golfers can not only use golf premium services, but they also have a chance to experience the first-ever radar technology solutions from the UK.',
        'LPD Token is a disruptive opportunity to invest in a high potential, transparent, liquidatable golf project. In addition to the high-profit investment, investors are entitled to privileges to enjoy complimentarily premium services at CitiGolf.',
      ],
      links: [
        {
          label: 'Website',
          url: 'https://lpdi.io',
        },
        {
          label: 'Official Telegram',
          url: 'https://t.me/citigolflpdi',
        },
        {
          label: 'Official Announcement',
          url: 'https://t.me/LPDiOfficialAnnouncement',
        },
        {
          label: 'Twitter',
          url: 'https://twitter.com/GolfCiti',
        },
        {
          label: 'Read our White Paper',
          regionUrl: [
            {
              label: 'English',
              url: 'https://bit.ly/3rnmBZy',
            },
            {
              label: 'Vietnamese',
              url: 'https://bit.ly/2UpP1q5',
            },
          ],
        },
        {
          label: 'Private Sale',
          url: 'https://forms.gle/gpTMYtMaGxnBNMA98',
        },
      ],
      videoUrl: '/ido/lpdi.mp4',
    },
    socialLink: [
      {
        title: 'Website',
        link: 'https://lpdi.io/',
        src: '/icon/website-white.svg',
      },
      {
        title: 'Twitter',
        link: 'https://twitter.com/GolfCiti',
        src: '/icon/twitter-white.svg',
      },
      {
        title: 'Telegram',
        link: 'https://t.me/citigolflpdi',
        src: '/icon/telegram-white.svg',
      },
    ],
    tokenInfo: {
      name: 'LPD Invest',
      symbol: TOKEN_IDO.lpdi.symbol,
      totalSupply: 400000000,
      totalSupplyOnKai: 200000000,
    },
    options: {
      labels: [
        {
          key: 'saleDate',
          text: 'Sale dates (UTC)',
        },
        {
          key: 'lockupRelease',
          text: 'Lockup & release',
        },
        {
          key: 'purchaseLimits',
          text: 'Purchase limits (KAI)',
        },
        {
          key: 'percentSupplyKai',
          text: '% of the Total supply (on Kai)',
        },
        {
          key: 'numberTokens',
          text: 'Number of Tokens',
        },
        {
          key: 'pricePerToken',
          text: 'Price per Token',
        },
        {
          key: 'value',
          text: 'Value',
        },
        {
          key: 'minSlots',
          text: 'Min Slots',
        },
        {
          key: 'maxSlots',
          text: 'Max Slots',
        },
      ],
      data: [
        {
          index: 0,
          label: 'Option 1',
          poolContract: {
            address: '0x06eaFF6EB7A2cb7991497360aFeE76195B6173CA',
            stakingRequire: 5000,
            stakingCount: 380,
          },
          idoContract: {
            address: '0xA0dA6C34D803B2c035c8191a5E9e06f264954ad9',
            openTime: 1627387200000,
            closeTime: 1627992000000,
            claimTime: 1627992000000,
            softCap: 115385,
            hardCap: 1153846,
            totalSupply: 2000000,
            abiKey: 'ido1Abi',
            totalCollected: 1153647,
          },
          unStakeTime: 1628424000000,
          buyTokenPrice: 0.052,
          minInvest: 4807,
          maxInvest: 9615,
          values: {
            saleDate: {
              dateOpen: 1627387200000,
              dateClose: 1627992000000,
            },
            lockupRelease: {
              text: 'Freely tradeable',
            },
            purchaseLimits: {
              text: '4,807 - 9,615',
            },
            percentSupplyKai: {
              number: 1,
              unit: '%',
            },
            numberTokens: {
              number: 2000000,
            },
            pricePerToken: {
              unit: 'KAI',
              number: 0.576923,
              decimals: 6,
            },
            value: {
              number: 60000,
              prefix: '$',
            },
            minSlots: {
              number: 120,
            },
            maxSlots: {
              number: 240,
            },
          },
        },
        {
          index: 1,
          label: 'Option 2',
          poolContract: {
            address: '0xB5FE3610acf20144e4DEB77064C0dF0269110c06',
            stakingRequire: 10000,
            stakingCount: 112,
          },
          idoContract: {
            address: '0x6E6536B91DBE84436D88C4B2ED33e72BC2075aD2',
            openTime: 1627473600000,
            closeTime: 1628683200000,
            claimTime: 1643371200000,
            claimTimes: 6,
            softCap: 721154,
            hardCap: 7211535,
            totalSupply: 15000000,
            abiKey: 'ido2Abi',
            multipleClaim: true,
            claimCycle: 2592000000,
            totalCollected: 2964202.227,
          },
          unStakeTime: 1628769600000,
          minInvest: 9616,
          maxInvest: 38461,
          values: {
            saleDate: {
              dateOpen: 1627473600000,
              dateClose: 1628683200000,
            },
            lockupRelease: {
              text: 'Locked 6 months, claim 6 times from month 7 - 12',
            },
            purchaseLimits: {
              text: '9,616 - 38,461',
            },
            percentSupplyKai: {
              number: 7.5,
              unit: '%',
              decimals: 1,
            },
            numberTokens: {
              number: 15000000,
            },
            pricePerToken: {
              unit: 'KAI',
              number: 0.480769,
              decimals: 6,
            },
            value: {
              number: 375000,
              prefix: '$',
            },
            minSlots: {
              number: 187.5,
              decimals: 1,
            },
            maxSlots: {
              number: 750,
            },
          },
        },
        {
          index: 2,
          label: 'Option 3',
          poolContract: {
            address: '0x60D75E0E41fd01C69b8A062261431C42FF7fE458',
            stakingRequire: 10000,
            stakingCount: 69,
          },
          idoContract: {
            address: '0x4CfbB6C5eCd45948c08354Ec3302D3984319312e',
            openTime: 1627560000000,
            closeTime: 1628769600000,
            claimTime: 1659096000000,
            claimTimes: 12,
            softCap: 499999,
            hardCap: 4999995,
            totalSupply: 13000000,
            abiKey: 'ido3Abi',
            multipleClaim: true,
            claimCycle: 2592000000,
            totalCollected: 4999995,
          },
          unStakeTime: 1628856000000,
          minInvest: 38462,
          maxInvest: 192307,
          values: {
            saleDate: {
              dateOpen: 1627560000000,
              dateClose: 1628769600000,
            },
            lockupRelease: {
              text: 'Locked 12 months, claim 12 times from month 13 - 24',
            },
            purchaseLimits: {
              text: '38,462 - 192,307',
            },
            percentSupplyKai: {
              number: 6.5,
              unit: '%',
              decimals: 1,
            },
            numberTokens: {
              number: 13000000,
            },
            pricePerToken: {
              unit: 'KAI',
              number: 0.384615,
              decimals: 6,
            },
            value: {
              prefix: '$',
              number: 260000,
            },
            minSlots: {
              number: 26,
            },
            maxSlots: {
              number: 130,
            },
          },
        },
      ],
    },
  },
]

export default configLands
