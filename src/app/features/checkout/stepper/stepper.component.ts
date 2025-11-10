import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  active: boolean;
  disabled: boolean;
}

@Component({
  selector: 'app-stepper',
  standalone: false,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep: number = 0;
  @Output() stepChange = new EventEmitter<number>();

  onStepClick(stepIndex: number): void {
    if (!this.steps[stepIndex].disabled) {
      this.stepChange.emit(stepIndex);
    }
  }

  getStepStatus(step: Step, index: number): string {
    if (step.completed) return 'completed';
    if (index === this.currentStep) return 'active';
    if (index < this.currentStep) return 'completed';
    return 'pending';
  }

  getStepClasses(step: Step, index: number): string {
    const status = this.getStepStatus(step, index);
    const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200';
    
    if (step.disabled) {
      return `${baseClasses} step-disabled`;
    }
    
    switch (status) {
      case 'completed':
        return `${baseClasses} step-completed`;
      case 'active':
        return `${baseClasses} step-active`;
      default:
        return `${baseClasses} step-pending`;
    }
  }

  getStepTitleClasses(step: Step, index: number): string {
    const status = this.getStepStatus(step, index);
    const baseClasses = 'text-sm font-semibold transition-colors duration-200';
    
    if (step.disabled) {
      return `${baseClasses} title-disabled`;
    }
    
    switch (status) {
      case 'completed':
        return `${baseClasses} title-completed`;
      case 'active':
        return `${baseClasses} title-active`;
      default:
        return `${baseClasses} title-pending`;
    }
  }

  getConnectorClasses(step: Step, index: number): string {
    const status = this.getStepStatus(step, index);
    const baseClasses = 'flex-1 h-0.5 mx-4 transition-colors duration-200';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} connector-completed`;
      case 'active':
        return `${baseClasses} connector-active`;
      default:
        return `${baseClasses} connector-pending`;
    }
  }
}
