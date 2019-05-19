# opiodnetwork

Network for tracking opioid activity


### Starting the Fabric Network:

composer archive create --sourceType dir --sourceName . -a opiodnetwork@0.0.1.bna

composer network install --card PeerAdmin@hlfv1 --archiveFile opiodnetwork@0.0.1.bna

composer network start --networkName opiodnetwork --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

composer card import --file networkadmin.card

composer network ping --card admin@opiodnetwork


composer-rest-server


### Starting the web app:
npm install && ng serve && node server.js