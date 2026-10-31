import logging
import os
import time

from flask import Flask, g, request

LOG_FORMAT = "%(asctime)s %(levelname)-7s %(name)s: %(message)s"

request_logger = logging.getLogger("app.request")


def configure_logging(app: Flask) -> None:
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(level=level, format=LOG_FORMAT, force=True)
    logging.getLogger("werkzeug").setLevel(logging.WARNING)

    @app.before_request
    def _start_timer():
        g._request_start = time.perf_counter()

    @app.after_request
    def _log_request(response):
        start = g.pop("_request_start", None)
        duration_ms = (time.perf_counter() - start) * 1000 if start else 0
        user = g.get("current_user")
        user_id = user.id if user is not None else "-"

        level = logging.INFO
        if response.status_code >= 500:
            level = logging.ERROR
        elif response.status_code >= 400:
            level = logging.WARNING

        request_logger.log(
            level, "%s %s -> %s (%.0f ms) user=%s",
            request.method, request.path, response.status_code, duration_ms, user_id,
        )
        return response
