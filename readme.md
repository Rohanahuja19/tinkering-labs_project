OVERVIEW:


The Web Annotator Extension is a Chrome extension designed to enable users to annotate web pages. Users can draw with a pen, highlight text, add notes, undo actions, and save their drawings. The extension consists of a popup interface where users can select tools and interact with the webpage to make annotations.


INTRODUCTION

But what is a Web Annotator?

A web annotator, in this context, is a Chrome extension that enhances user engagement with online content by offering tools for highlighting and annotating text on any webpage. It allows users to mark key sections with customizable color-coded highlights and add personal notes for additional context. These annotations are saved and persist across browser sessions, ensuring users can access their work anytime. The extension also provides features like keyboard shortcuts and a responsive design for optimal use on various devices. It aims to boost efficiency and organization for researchers, students, and professionals.

Motivation of Project:

As soon as Tinkering Labs released this project, I thought of starting with my hands-on web development experience since I've never tried it before. It was a fun task and I learned many things while executing it. Also, this project is quite useful for teachers as well as students to explain and understand the concepts available online well. I also wanted to enhance my JavaScript skills by implementing a variety of functions which was fulfilled by working on this project. I have never developed a Chrome extension hence I was excited about making this.

Application Domain:

1. Education: Enhancing the learning experience for students and educators by allowing them to highlight and annotate online course materials, academic papers, and e-books.
2. Research: Assisting researchers in efficiently marking and taking notes on online journals, articles, and other digital resources, facilitating better organization and retrieval of information.
3. Professional Use: Helping professionals in various fields to annotate and review online reports, documents, and resources, improving productivity and collaboration.
4. Personal Knowledge Management: Aiding individuals in bookmarking, highlighting, and annotating web content for personal projects, interests, or daily reading, promoting better knowledge retention and organization.
5. Collaborative Work: Supporting collaborative annotation and sharing among teams, enabling better communication and idea exchange in academic, professional, and personal contexts.



How a Chrome Extension is Created?

A typical Chrome extension is created by the numerous files, and it is further loaded unpacked in the developer mode. These files are as follows:

1. The Manifest File (manifest.json):

The manifest file is a JSON file that provides essential information about the extension. It includes details such as the extension's name, version, description, permissions (e.g., access to tabs, storage, and web requests), content scripts, background scripts, icons, and more. It serves as the roadmap for Chrome to understand how the extension should behave and what resources it requires. Hence it is the first file ever to be created when making an extension!

2. Background Script (background.js):

The background script runs in the background and is responsible for managing the extension's core functionality. It's specified in the manifest file under the "background" key. This script can listen for events such as tab changes, browser actions, and network requests. It's also used to maintain the extension's state and handle tasks that don't require user interaction.

3. Content Script (content.js):

Content scripts are injected into web pages based on specified URL patterns defined in the manifest file. These scripts can interact with the DOM of the web page, modify its content, and communicate with the background script using message passing. Content scripts are often used to enhance or modify the behavior of specific web pages to provide additional functionality.

4. Popup HTML (popup.html) and Popup Script (popup.js):

If your extension has a browser action or page action that displays a popup when clicked, you'll need a popup.html file to define the structure of the popup and a popup.js file to handle its logic. The popup can contain UI elements such as buttons, input fields, or other interactive components. The popup script can interact with the background script and perform actions based on user input.

5. Images and Other Assets:

Icons are crucial for representing the extension in the Chrome Web Store and in the browser toolbar. The manifest file specifies various icon sizes for different use cases. Additionally, you may include other assets such as images or CSS files for styling your extension's UI.

![This is how it looks like](<project image.jpg>)


