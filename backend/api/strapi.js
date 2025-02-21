const apiUrl = 'http://10.200.22.17:13339/api/issues';
const apiHome = 'http://10.40.5.151:13339/api/issues';


// Function to add an issue
// Function to add an issue
export const addIssue = async (title, description, date, category, location, image) => {
  try {
    // Create the request body data (simulating a form submit with data fields)
    const formData = new FormData();
    formData.append("data[title]", title);
    formData.append("data[description]", description);
    formData.append("data[date]", date.toISOString()); // Ensure date is in the right format
    formData.append("data[category]", category);
    formData.append("data[location]", location);

    // If image is selected, add it to the FormData
    if (image) {
      const imageUri = image;
      const imageName = imageUri.split('/').pop(); // Extract file name
      const fileType = imageUri.split('.').pop(); // Extract file type (e.g., png, jpg)
      const imageFile = {
        uri: imageUri,
        name: imageName,
        type: `image/${fileType}`,  // Adjust MIME type based on file extension
      };
      formData.append('files.photo', imageFile);  // Use 'files.photo' or 'files.image' based on your setup
    }

    // Use Fetch API to send the data to the Strapi backend
    const response = await fetch(apiHome, {
      method: 'POST',
      body: formData,  // Let FormData handle the Content-Type header
    });

    // Log the response body for debugging
    const responseBody = await response.json();
    console.log('Strapi Response:', responseBody);

    // Check if response is okay
    if (!response.ok) {
      throw new Error(`Failed to create the issue. Response: ${JSON.stringify(responseBody)}`);
    }

    // Return the result from Strapi
    return responseBody;

  } catch (error) {
    console.error('Error submitting issue:', error);
    throw error; // Re-throw error to handle it in the component
  }
};
