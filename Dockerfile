FROM node:8.12.0-alpine

WORKDIR /do-sshd

RUN apk add --no-cache openssh \
  && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
  && echo "root:root" | chpasswd

COPY package.json package-lock.json ./

RUN npm i

COPY ./ ./

EXPOSE 22

ENTRYPOINT ["/do-sshd/entrypoint.sh"]
