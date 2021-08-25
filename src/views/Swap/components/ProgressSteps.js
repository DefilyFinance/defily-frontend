/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
export default function ProgressCircles({ steps, disabled = false, ...rest }) {
  return (
    <div justify="center" {...rest}>
      <div>
        {steps.map((step, i) => {
          return (
            <div key={i}>
              <div confirmed={step} disabled={disabled || (!steps[i - 1] && i !== 0)}>
                {step ? '✓' : i + 1}
              </div>
              <div prevConfirmed={step} disabled={disabled} />
            </div>
          )
        })}
        <div disabled={disabled || !steps[steps.length - 1]}>{steps.length + 1}</div>
      </div>
    </div>
  )
}
