FROM node:20-alpine

RUN npm install -g firebase-tools@13

WORKDIR /firebase

COPY firebase.json .firebaserc ./

EXPOSE 4000 8080 9099

CMD ["firebase", "emulators:start", "--only", "auth,firestore", "--project", "demo-hakkason"]
