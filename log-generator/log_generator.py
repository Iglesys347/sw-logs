"""Generate logs from files stored in ./data.

This application is using the log handler RedisStreamLogHandler from package redis-logs
to forward the logs generated to a Redis Stream.
Its purpose is to demonstrate the strength of log centralization using Redis Streams.
In real life, one could imagine different real python application sending their logs to
Redis Streams following the same process."""

import argparse
import logging
import re
import random
import time

from rlh import RedisStreamLogHandler


DIALOG_REGEXP = re.compile(r'^[A-Z\-\s0-9]+ : ')


def main(logger, data_file, delay_per_char=0.05):
    """Main function used to generate plenty of logs."""
    with open(data_file, "r", encoding="utf8") as file:
        message_buffer = []
        dialog = False

        for line in file:
            if line.isupper():
                logger.debug(line[:-1])
            elif re.match(DIALOG_REGEXP, line):
                if message_buffer:
                    if random.randint(0, 1):
                        logger.warning(" ".join(message_buffer))
                        time.sleep(delay_per_char *
                                   len(" ".join(message_buffer)))
                    else:
                        logger.error(" ".join(message_buffer))
                        time.sleep(delay_per_char *
                                   len(" ".join(message_buffer)))
                    message_buffer = []
                    dialog = False
                message_buffer.append(line[:-1])
                dialog = True
            else:
                if line == "\n":
                    if message_buffer:
                        if dialog:
                            if random.randint(0, 1):
                                logger.warning(" ".join(message_buffer))
                                time.sleep(delay_per_char *
                                           len(" ".join(message_buffer)))
                            else:
                                logger.error(" ".join(message_buffer))
                                time.sleep(delay_per_char *
                                           len(" ".join(message_buffer)))
                        else:
                            logger.info(" ".join(message_buffer))
                            time.sleep(delay_per_char *
                                       len(" ".join(message_buffer)))
                        message_buffer = []
                        dialog = False
                else:
                    message_buffer.append(line[:-1])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file", help="data file path", required=True)
    parser.add_argument("-d", "--delay",
                        help="delay to apply between messages for each character",
                        required=False)
    parser.add_argument("-l", "--loop", action="store_true",
                        help="start again from the beginning of the file once finished",
                        required=False)

    parser.add_argument("--redis-host", help="hostname of the Redis DB",
                        default="localhost")
    parser.add_argument("--redis-port", help="port of the Redis DB",
                        default=6379)
    parser.add_argument("--redis-stream", help="stream name of the Redis DB",
                        default="log_generator")

    args = parser.parse_args()
    print(args.redis_host, args.redis_port)

    # we do not want our stream to get bigger and bigger, so we set its maxlen to 100
    handler = RedisStreamLogHandler(stream_name=args.redis_stream, maxlen=100,
                                    host=args.redis_host, port=args.redis_port)

    logging.basicConfig()
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)

    if args.loop:
        while True:
            main(logger, args.file)
    else:
        main(logger, args.file)
