# Peeksta - Instagram Follower Analysis Tool

Peeksta is a simple web application that helps you analyze your Instagram followers and following lists to identify who is not following you back. It allows you to upload your Instagram data in a ZIP file, and then provides a searchable list of users who are not reciprocating your follow.

## Features

-   **Upload Instagram Data:** Accepts a ZIP file containing your Instagram followers and following data in JSON format.
-   **Follower Analysis:** Processes the data to identify users who are not following you back.
-   **Searchable User List:** Presents a list of users who are not following back, with a search bar to easily filter the list.
-   **Direct Instagram Profile Links:** Each username in the list links directly to their Instagram profile for easy access.
-   **Dark Mode Support:** Automatically adjusts to your system's color scheme for a comfortable viewing experience.
-   **Drag and Drop Upload:** Enhanced user experience for uploading files with drag and drop functionality and a visual overlay.
-   **Responsive Design:**  Works well across different screen sizes.

## Getting Started

Follow these instructions to get the application running on your local machine:

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/peeksta.git
    cd peeksta
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

1. **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2. **Open your browser:**

   Visit [http://localhost:5173](http://localhost:5173) (or the port specified in the console) to view the application.

### How to Use

1. **Download Your Instagram Data:**
    -   Visit the [Instagram Data Download](https://accountscenter.instagram.com/info_and_permissions/dyi/) page.
    -   Request a download of your data in JSON format. You will receive a ZIP file.
2. **Upload Your ZIP File:**
    -   Drag and drop the ZIP file into the designated area on the Peeksta website.
    -   Alternatively, click the upload area and select the ZIP file from your computer.
3. **Analyze Your Followers:**
    -   Once the file is uploaded and processed, Peeksta will display a list of users who are not following you back.
    -   Use the search bar to quickly find specific users.
    -   Click on a username to view their Instagram profile directly.

## Project Structure

The project is organized into the following directories and files:

-   `src/`: Contains the source code for the application.
    -   `components/`: React components for different parts of the UI.
    -   `hooks/`: Custom React hooks for logic reusability.
    -   `styles/`: Styled components and global styles for the application.
    -   `App.jsx`: Main application component.
    -   `main.jsx`: Entry point of the application.
-   `public/`: Static assets.
    -   `assets/`: Images and other assets.
-   `index.html`: Main HTML file.
-   `package.json`: Project dependencies and scripts.

## Technologies Used

-   [React](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [Styled Components](https://styled-components.com/)
-   [JSZip](https://stuk.github.io/jszip/)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
