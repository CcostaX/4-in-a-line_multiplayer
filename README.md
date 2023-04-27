# 4-in-a-line_multiplayer
Multiplayer Four in a Line game, built with HTML, CSS, and JavaScript, that uses Docker for local play and Terraform and Google Cloud for online play (cloud). Four in a Line is a classic two-player strategy game in which the participants strive to create a sequence of four tokens on a grid. As it is a solved game, the first player can always win by utilizing the right strategies, making it ideal for players of all skill levels. The game is developed as a web application, following the project requirements, which include decoupling it into three microservices, provisioning with Terraform, and utilizing automated deployments from a Git repository.

The project is organized in a structured file system that separates the client-side, server-side, and infrastructure elements. The system comprises a client, WebSocket server, and REST API, all interconnected, with MongoDB serving as the database for the REST API, MongoDB local and MongoDB Atlas for cloud. The client side deals with the user interface and game logic, whereas the server side handles the WebSocket server, database connection and REST API to enable real-time communication between players and preserve game data. By using contemporary technologies such as Node.js, Express.js, and MongoDB, this project ensures a seamless and captivating gaming experience for all users. 

The addition of Docker and Terraform streamlines the deployment process offline and online and allows for easy scaling of the application. In this project, Docker is used to containerize each microservice (client, server, and database) to enable smooth deployment and testing in a local environment and Terraform is used to provision and manage the necessary project components on Google Cloud Platform.

The Four in a Line web application offers a captivating multiplayer gaming experience, leveraging a carefully designed architecture that facilitates seamless user interaction, real-time communication between players, efficient management of game data, and streamlined deployment across various environments. It was applied two distinct deployment architectures have been implemented to accommodate both local and cloud (online) scenarios, ensuring a versatile and accessible gaming experience for users.

Local Deployment (Docker): In the local deployment scenario, Docker is employed to containerize each microservice (client-side, WebSocket server, REST API, and MongoDB). Docker provides a consistent and isolated environment for each component, enabling developers to easily deploy, test, and manage the application in a local environment. Figure 1 represents the system architecture In a local environment using Docker.

<img width="499" alt="image" src="https://user-images.githubusercontent.com/93092772/234859731-409e1a2b-4920-4700-8e8a-845935bdc5a3.png">

Cloud Deployment (Google Cloud and Terraform): In the cloud deployment scenario, the application is hosted on Google Cloud Platform (GCP), which provides a robust, scalable, and reliable infrastructure for deploying, scaling, and managing the application. Terraform is used to automate the provisioning and management of infrastructure components on GCP. By leveraging GCP's powerful infrastructure and services, the application can scale effortlessly to accommodate many users while maintaining optimal gaming experiences. This approach ensures that the game remains responsive and engaging, even as the number of players increases. Figure 2 represents the system architecture In a cloud environment using Google Cloud and Terraform.

<img width="464" alt="image" src="https://user-images.githubusercontent.com/93092772/234859838-95ca7228-be25-4c9f-85a4-9ecdcd8434a8.png">

# RUN LOCALLY (DOCKER)
To test the application locally, the user needs:
  o	Have the Docker application opened.
  
  o	Open a command prompt and going to the project folder path.
  o	Use these commands to deploy to docker
  
    docker-compose down
    docker-compose build
    docker-compose up -d
    
o	Test the application with the URL provided in Docker (test the application in client: localhost:8080)

# RUN IN CLOUD (GOOGLE CLOUD AND TERRAFORM)
To test the application in the cloud, the user needs:

o	A key .json file for the credentials in Google Cloud

o	Create an account in MongoDB Atlas or use a provided account.

o	Create or use the file "terraform.tfvars”, to insert the credentials:

  •	Project_id = “id of your google cloud project)
  •	Region (it depends on your region, In this project it was used “us-central1”)
  
  •	Zone (it depends on your region and zone, In this project it was used “us-central1-a”)
  
  •	Mongodb_username (username of your MongoDB Atlas)
  
  •	Mongodb_password (password of your MongoDB Atlas)
  
o	Deploy the application using:

    Terraform init   
    Terraform apply 
    Terraform destroy //(if your done using the application to not waste resources)
    
o	Test the application with the URL provided in Google Cloud Run: https://client-service-ntcbm2lmna-uc.a.run.app
