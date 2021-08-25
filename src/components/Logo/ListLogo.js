import Logo from 'components/Logo/Logo'

const ListLogo = ({ srcs, alts, size = 20, className }) => {
  return (
    <div className={className}>
      {srcs.map((src, i) => (
        <Logo ley={i} src={src} alt={alts[i]} size={size} className="inline-block" />
      ))}
    </div>
  )
}

export default ListLogo
