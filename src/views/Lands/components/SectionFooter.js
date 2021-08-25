import React from 'react'

const SectionFooter = () => {
  const data = [
    {
      img: '/icon/world.svg',
      title: 'Exposure',
      text: 'Get exposure to the millions of Defily users around the world.',
    },
    {
      img: '/icon/water.svg',
      title: 'Liquidity',
      text: 'Projects that are launched on Launchpad will be listed and have world-class liquidity in multiple trading pairs.',
    },
    {
      img: '/icon/money.svg',
      title: 'Token Distribution',
      text: 'Your token will immediately be distributed to a large user base that hold your token.',
    },
    {
      img: '/icon/circle.svg',
      title: 'Future Synergy',
      text: 'Project will receive extensive support and advice even after listing, having access to all areas of the Defily ecosystem.',
    },
  ]

  return (
    <div className="bg-blue1 px-6 pt-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {data.map((item, index) => (
          <div key={index} className="text-center m-auto p-8">
            <div className="flex justify-center">
              <img
                alt={item.title}
                src={item.img}
                style={{
                  width: 80,
                  height: 80,
                }}
              />
            </div>
            <p className="text-primary text-lg font-bold my-4">{item.title}</p>
            <p className="text-white">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionFooter
