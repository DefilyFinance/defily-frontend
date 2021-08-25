import Tooltip from 'components/Tooltip/Tooltip'
import { HelpCircle } from 'react-feather'
import classnames from 'classnames'

const QuestionHelper = ({ classNameToolTip, text, ...props }) => {
  return (
    <Tooltip classNameToolTip={classnames('w-80', classNameToolTip)} tooltip={text} {...props}>
      <HelpCircle className="ml-1" size={16} />
    </Tooltip>
  )
}

export default QuestionHelper
