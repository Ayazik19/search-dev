import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CreateResumePage from './createResumePage';
import { setCheckIsCorrectsSteps, setNextStep } from '../../store/stepsResume';

const dispatchMock = vi.fn();

vi.mock('../../hookRedux', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) => selector({
    stepsResume: {
      stateStepsResume: {
        stepsResume: [
          {
            currentStep: 3,
            status: 'beginning',
          },
        ],
      },
    },
    resumes: {
      resumesState: {
        nameResume: 'Test resume',
        education: {
          educationClass: 'There is no education in IS',
        },
        typeWorkResume: 'c',
        statusSearchResume: 'Looking for work',
        levelIsResume: 'Middle',
      },
    },
  }),
}));

vi.mock('./componentsStepsResume/stepResumeOne', () => ({
  default: () => <div>Step 1</div>,
}));
vi.mock('./componentsStepsResume/stepResumeTwo', () => ({
  default: () => <div>Step 2</div>,
}));
vi.mock('./componentsStepsResume/stepResumeThree', () => ({
  default: () => <div>Step 3</div>,
}));
vi.mock('./componentsStepsResume/stepResumeFour', () => ({
  default: () => <div>Step 4</div>,
}));
vi.mock('./componentsStepsResume/stepsResumeFive', () => ({
  default: () => <div>Step 5</div>,
}));
vi.mock('./componentsStepsResume/stepResumeSix', () => ({
  default: () => <div>Step 6</div>,
}));
vi.mock('./componentsStepsResume/stepsSucces', () => ({
  default: () => <div>Steps success</div>,
}));
vi.mock('./componentsStepsResume/ModalContResumeInfo', () => ({
  default: () => null,
}));

// describe('CreateResumePage', () => {
//   beforeEach(() => {
//     dispatchMock.mockClear();
//   });

//   it('dispatches next step when Next button is clicked', async () => {
//     const user = userEvent.setup();

//     render(<CreateResumePage />);

//     await user.click(screen.getByRole('button', { name: /save and continue/i }));

//     expect(dispatchMock).toHaveBeenCalledWith(setNextStep(6));
//     expect(dispatchMock).toHaveBeenCalledWith(setCheckIsCorrectsSteps());
//   });
// });
