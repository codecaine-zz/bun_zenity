// Complete demo of all Zenity wrapper functionality
import Zenity from './zenity-wrapper';

const zenity = new Zenity();

async function demoAllFeatures() {
  try {
    console.log("=== Zenity Wrapper Complete Demo ===\n");

    // 1. Info Dialog
    console.log("1. Info Dialog");
    await zenity.info("This is an info dialog", { title: "Information" });

    // 2. Warning Dialog
    console.log("2. Warning Dialog");
    await zenity.warning("This is a warning!", { title: "Warning" });

    // 3. Error Dialog
    console.log("3. Error Dialog");
    await zenity.error("This is an error message", { title: "Error" });

    // 4. Question Dialog
    console.log("4. Question Dialog");
    const answer = await zenity.question("Do you want to continue the demo?", {
      title: "Question",
      okLabel: "Yes, continue",
      cancelLabel: "No, stop"
    });
    console.log("User answered:", answer ? "Yes" : "No");
    if (!answer) {
      console.log("Demo cancelled by user");
      return;
    }

    // 5. Entry Dialog
    console.log("\n5. Entry Dialog");
    const name = await zenity.entry("Enter your name:", {
      entryText: "John Doe"
    });
    console.log("Name entered:", name);

    // 6. Password Dialog
    console.log("\n6. Password Dialog");
    const password = await zenity.password({ username: true });
    console.log("Password/Username entered:", password ? "***hidden***" : "cancelled");

    // 7. Entry Dialog with Hidden Text
    console.log("\n7. Entry Dialog (Hidden Text)");
    const secret = await zenity.entry("Enter a secret:", {
      hideText: true
    });
    console.log("Secret entered:", secret ? "***hidden***" : "cancelled");

    // 8. List Dialog - Simple
    console.log("\n8. List Dialog (Simple)");
    const selectedItem = await zenity.list(
      "Select an item:",
      ["Item"],
      [["Apple"], ["Banana"], ["Orange"], ["Grape"]]
    );
    console.log("Selected item:", selectedItem);

    // 9. List Dialog - Checklist
    console.log("\n9. List Dialog (Checklist)");
    const selectedFruits = await zenity.list(
      "Select your favorite fruits:",
      ["Select", "Fruit", "Color"],
      [
        [false, "Apple", "Red"],
        [false, "Banana", "Yellow"],
        [false, "Orange", "Orange"],
        [false, "Grape", "Purple"]
      ],
      { checklist: true, multiple: true }
    );
    console.log("Selected fruits:", selectedFruits);

    // 10. List Dialog - Radio List
    console.log("\n10. List Dialog (Radio List)");
    const selectedOS = await zenity.list(
      "Select your operating system:",
      ["Select", "OS", "Year"],
      [
        [false, "Linux", "1991"],
        [true, "macOS", "2001"],
        [false, "Windows", "1985"]
      ],
      { radiolist: true }
    );
    console.log("Selected OS:", selectedOS);

    // 11. File Selection Dialog
    console.log("\n11. File Selection Dialog");
    const file = await zenity.fileSelection({ multiple: false });
    console.log("Selected file:", file);

    // 12. File Selection Dialog - Multiple
    console.log("\n12. File Selection Dialog (Multiple)");
    const files = await zenity.fileSelection({ 
      multiple: true,
      separator: "|" 
    });
    console.log("Selected files:", files);

    // 13. Directory Selection
    console.log("\n13. Directory Selection");
    const directory = await zenity.fileSelection({ directory: true });
    console.log("Selected directory:", directory);

    // 14. File Save Dialog
    console.log("\n14. File Save Dialog");
    const saveFile = await zenity.fileSelection({ 
      save: true,
      confirmOverwrite: true,
      filename: "untitled.txt"
    });
    console.log("Save location:", saveFile);

    // 15. Color Selection
    console.log("\n15. Color Selection");
    const color = await zenity.colorSelection({ 
      color: "#FF5733",
      showPalette: true 
    });
    console.log("Selected color:", color);

    // 16. Calendar Dialog
    console.log("\n16. Calendar Dialog");
    const date = await zenity.calendar("Select a date:", {
      day: 21,
      month: 11,
      year: 2025,
      dateFormat: "%Y-%m-%d"
    });
    console.log("Selected date:", date);

    // 17. Scale Dialog
    console.log("\n17. Scale Dialog");
    const scaleValue = await zenity.scale("Select a value:", {
      value: 50,
      minValue: 0,
      maxValue: 100,
      step: 5
    });
    console.log("Selected value:", scaleValue);

    // 18. Scale Dialog with Hidden Value
    console.log("\n18. Scale Dialog (Hidden Value)");
    const hiddenScale = await zenity.scale("Adjust the slider:", {
      value: 25,
      minValue: 0,
      maxValue: 100,
      step: 1,
      hideValue: true
    });
    console.log("Selected value:", hiddenScale);

    // 19. Forms Dialog - Basic
    console.log("\n19. Forms Dialog (Basic)");
    const formData = await zenity.forms(
      "Please enter your information:",
      [
        { type: 'entry', label: 'Name' },
        { type: 'entry', label: 'Email' },
        { type: 'password', label: 'Password' }
      ],
      { separator: "|" }
    );
    console.log("Form data:", formData);

    // 20. Forms Dialog - Advanced
    console.log("\n20. Forms Dialog (Advanced)");
    const advancedForm = await zenity.forms(
      "Registration Form:",
      [
        { type: 'entry', label: 'Username' },
        { type: 'password', label: 'Password' },
        { type: 'calendar', label: 'Birth Date' },
        { 
          type: 'list', 
          label: 'Country', 
          items: ['USA', 'Canada', 'UK', 'Australia'] 
        }
      ]
    );
    console.log("Advanced form data:", advancedForm);

    // 21. Text Dialog
    console.log("\n21. Text Dialog");
    const editedText = await zenity.text("This is a text information dialog.\n\nYou can edit and write in this text area.", { editable: true });
    console.log("Edited text:", editedText);

    // 22. Progress Dialog - Pulsate
    console.log("\n22. Progress Dialog (Pulsate)");
    const pulsateProcess = await zenity.progress("Processing...", { 
      pulsate: true, 
      autoClose: true, 
      noCancel: true 
    });
    setTimeout(() => {
      if (pulsateProcess.stdin && typeof pulsateProcess.stdin !== 'number') {
        const encoder = new TextEncoder();
        pulsateProcess.stdin.write(encoder.encode('100\n'));
        pulsateProcess.stdin.end();
      }
    }, 2000);
    await pulsateProcess.exited;
    console.log("Pulsate progress completed");

    // 23. Progress Dialog - Percentage
    console.log("\n23. Progress Dialog (Percentage)");
    const percentProcess = await zenity.progress("Loading...", { 
      percentage: 0, 
      autoClose: true 
    });
    if (percentProcess.stdin && typeof percentProcess.stdin !== 'number') {
      const encoder = new TextEncoder();
      for (let i = 0; i <= 100; i += 10) {
        percentProcess.stdin.write(encoder.encode(`${i}\n`));
        percentProcess.stdin.write(encoder.encode(`# Loading ${i}%\n`));
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      percentProcess.stdin.end();
    }
    await percentProcess.exited;
    console.log("Percentage progress completed");

    console.log("\n=== All Demos Completed! ===");
    
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
  }
}

// Run all demos
demoAllFeatures();
