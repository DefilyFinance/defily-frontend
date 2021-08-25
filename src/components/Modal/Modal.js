/* This example requires Tailwind CSS v2.0+ */
import classnames from 'classnames'
import { Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Transition } from '@headlessui/react'

export default function Modal({ open, onClose, children, size, className }) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={() => onClose && onClose()}
      >
        <div
          ref={cancelButtonRef}
          className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={classnames(
                'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full',
                size === 'lg' && 'sm:max-w-3xl',
                className,
              )}
            >
              <div className="bg-white p-4">{children}</div>
            </div>
          </Transition.Child>
        </div>
        <button className="opacity-0 absolute bottom-0" />
      </Dialog>
    </Transition.Root>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  size: PropTypes.string,
}
