import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
})
export class MyFormComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.maxLength(20)]],
      lastName: ["", [Validators.required, Validators.maxLength(20)]],
      middleName: ["", Validators.maxLength(20)],
      age: ["", [Validators.required, Validators.min(10), Validators.max(50)]],
      gender: [""], // Default value can be set
      address: this.fb.group({
        street: ["", [Validators.required, Validators.maxLength(20)]],
        landmark: ["", Validators.maxLength(20)],
        city: ["", [Validators.required, Validators.maxLength(20)]],
        state: ["", [Validators.required, Validators.maxLength(20)]],
        zipCode: ["", [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern("^[0-9]*$"),
        ]],
        country: ["", [Validators.required, Validators.maxLength(20)]],
      }),
      hobbies: this.fb.array([this.createHobbyField()]),
    });
  }

  get hobbies(): FormArray {
    return this.myForm.get("hobbies") as FormArray;
  }

  createHobbyField(): FormGroup {
    return this.fb.group({
      hobby: "",
    });
  }

  addHobbyField(): void {
    this.hobbies.push(this.createHobbyField());
  }

  removeHobbyField(index: number): void {
    this.hobbies.removeAt(index);
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      // ... Further processing, like sending the data to an API or service ...
    } else {
      this.validateAllFormFields(this.myForm); // Validate all fields
    }
  }
  shouldShowAgeError(): boolean {
    const ageControl = this.myForm.get("age");
    if (!ageControl) {
      return false;
    }
    const errors = ageControl.errors;
    const isTouched = ageControl.touched;
    return isTouched && errors && (errors["min"] || errors["max"]);
  }

  validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });

    if (formGroup instanceof FormArray) {
      formGroup.controls.forEach((control: AbstractControl) => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.validateAllFormFields(control);
        }
      });
    }
  }
}
