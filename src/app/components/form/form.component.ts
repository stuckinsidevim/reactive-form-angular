import { Component, OnInit } from "@angular/core";
import {
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
      gender: ["Male"],
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

  createHobbyField(): FormControl {
    return this.fb.control("", Validators.required);
  }

  addHobbyField(): void {
    const allHobbiesValid = this.hobbies.controls.every((control) =>
      control.valid
    );

    if (!allHobbiesValid) return;
    this.hobbies.push(this.createHobbyField());
  }

  removeHobbyField(index: number): void {
    this.hobbies.removeAt(index);
  }

  onSubmit() {
    if (this.myForm.valid) {
      alert(JSON.stringify(this.myForm.value, null, 4));
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
}
