import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'Package Challenge';
  selectedFileMessage: any;
  fileInputInvalid: boolean = false;
  extractedFileContents: any;
  outputResults: any;

  handleFormSubmission(event: Event): void {
    event.preventDefault(); // Will prevent the default form submission behavior of the page being refreshed
    const fileInput = document.getElementById('myFile') as HTMLInputElement;
    const rawFile = fileInput.files?.[0]; // Grabbing the file

    if (rawFile) {
      // File selected
      this.fileInputInvalid = false;
      // ...
    } else {
      // No file selected
      this.fileInputInvalid = true;
    }

    if (rawFile) {
      const fileReader = new FileReader(); // Lets web applications read files contents

      fileReader.onload = (e) => {
        // Operation will execute when the file has been read successfully
        const fileContents = fileReader.result as string; // Gets file contents and saves it as a string
        this.convertFileContentsToLineItems(fileContents);
        this.selectedFileMessage = 'File selected and form submitted!';
      };
      fileReader.readAsText(rawFile); // Once file is read as text. onload event will trigger.
    } else {
      this.fileInputInvalid = true;
    }
  }

  removeSelectedFile(): void {
    const removeFile = document.getElementById('myFile') as HTMLInputElement;
    if (removeFile) {
      removeFile.value = ''; // Clears the file input value
    }
    window.location.reload();
  }

  convertFileContentsToLineItems(fileContents: string): void {
    const splitLineItems = fileContents.split('\n'); // formatted file contents by Array
    this.buildPackageObject(splitLineItems);
  }

  buildPackageObject(fileItems: string[]) {
    const packageObject: any = {};
    for (let i = 0; i < fileItems.length; i++) {
      const matches = fileItems[i].matchAll(/((\d+),([^,]+),€(\d+))/g); // using regular exprssion matching to build package object
      packageObject[i] = Array.from(matches, (match) => ({
        index: parseInt(match[1]),
        weight: parseFloat(match[3]),
        cost: parseInt(match[4]),
        maxWeight: parseInt(fileItems[i].split(' : ')[0]), // Added max weight into each object to make data manipulation easier
      }));
    }
    this.setConstraints(packageObject);
    return packageObject;
  }

  setConstraints(packageObject: any): void {
    // removing any objects where the weight is greater than the max weight
    for (const key in packageObject) {
      if (Array.isArray(packageObject[key])) {
        packageObject[key] = packageObject[key].filter(
          (item: any) => item.weight <= item.maxWeight
        );
      }
    }
    this.showOutputResults(packageObject);
  }

  showOutputResults(packageObjectResult: any): void {
    // converting object to string and formating for output box
    this.outputResults = JSON.stringify(packageObjectResult, null, 2);
  }
}
