FROM node
WORKDIR .
COPY . .
EXPOSE 5000
ENV JWTSECRETKEY=abc123 \
	PORT=5000
CMD npm install ; npm run start