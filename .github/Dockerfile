FROM debian:latest

RUN apt update
RUN apt upgrade -y
RUN apt install curl -y
RUN apt install libicu-dev -y
RUN apt install openssh-server

RUN service ssh start

RUN useradd -d /runner --uid=1000 runner \
    && echo 'runner:runner' | chpasswd \
    && mkdir /runner \
    && chown -R runner:runner /runner

USER runner
WORKDIR /runner


RUN curl -o actions-runner-linux-x64-2.284.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.284.0/actions-runner-linux-x64-2.284.0.tar.gz

RUN tar xzf ./actions-runner-linux-x64-2.284.0.tar.gz

RUN ./config.sh --url $GH_URL --token $GH_TOKEN  --name docker-runner

CMD ["./run.sh"]
# CMD ["bash"]