FROM python:3.11.2-alpine3.17

WORKDIR /opt/swlogs

# copy script & data
ADD log_generator.py .
ADD data/* .

# install required package
RUN pip install redis-logs

ENTRYPOINT python log_generator.py -f sw_script_${EPISODE}.txt --redis-host=${REDIS_HOST} --redis-port=${REDIS_PORT} --redis-stream=swlogs:app${EPISODE}