FROM node:20-alpine

# Firestore Emulator requires Java
RUN apk add --no-cache openjdk17-jre \
  && npm install -g firebase-tools@13

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /firebase

COPY firebase.json .firebaserc ./

EXPOSE 4000 8080 9099

CMD ["firebase", "emulators:start", "--only", "auth,firestore", "--project", "demo-hakkason"]
