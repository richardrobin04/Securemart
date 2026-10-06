from collections import defaultdict


class CyberTwin:

    def __init__(self):

        self.users = defaultdict(dict)
        self.apis = defaultdict(dict)
        self.sessions = defaultdict(dict)

    # -------------------------
    # USER STATE
    # -------------------------

    def register_user(self, user_id):

        if user_id not in self.users:

            self.users[user_id] = {
                "user_id": user_id,
                "known_ips": set(),
                "known_endpoints": set(),
                "total_requests": 0,
                "failed_logins": 0,
                "successful_logins": 0
            }

    # -------------------------
    # API STATE
    # -------------------------

    def register_api(self, endpoint):

        if endpoint not in self.apis:

            self.apis[endpoint] = {
                "endpoint": endpoint,
                "total_requests": 0,
                "failed_requests": 0,
                "total_response_time": 0
            }

    # -------------------------
    # CHECK USER BEHAVIOUR
    # -------------------------

    def check_user_behaviour(self, event):

        user_id = event["user_id"]
        endpoint = event["endpoint"]
        ip = event["ip"]

        self.register_user(user_id)

        user = self.users[user_id]

        return {
            "known_user": True,

            "known_ip": ip in user["known_ips"],

            "known_endpoint":
                endpoint in user["known_endpoints"],

            "previous_requests":
                user["total_requests"],

            "previous_failed_logins":
                user["failed_logins"],

            "previous_successful_logins":
                user["successful_logins"]
        }

    # -------------------------
    # CHECK API BEHAVIOUR
    # -------------------------

    def check_api_behaviour(self, event):

        endpoint = event["endpoint"]

        self.register_api(endpoint)

        api = self.apis[endpoint]

        average_response_time = (
            api["total_response_time"] /
            api["total_requests"]
            if api["total_requests"] > 0
            else 0
        )

        return {
            "known_api": api["total_requests"] > 0,

            "previous_requests":
                api["total_requests"],

            "previous_failed_requests":
                api["failed_requests"],

            "average_response_time":
                average_response_time
        }

    # -------------------------
    # EVENT UPDATE
    # -------------------------

    def process_event(self, event):

        user_id = event["user_id"]
        endpoint = event["endpoint"]
        ip = event["ip"]

        self.register_user(user_id)
        self.register_api(endpoint)

        user = self.users[user_id]
        api = self.apis[endpoint]

        # Update user state
        user["known_ips"].add(ip)
        user["known_endpoints"].add(endpoint)

        user["total_requests"] += 1

        if event["event_type"] == "login":

            if event["success"]:
                user["successful_logins"] += 1
            else:
                user["failed_logins"] += 1

        # Update API state
        api["total_requests"] += 1

        api["total_response_time"] += event["response_time"]

        if not event["success"]:
            api["failed_requests"] += 1

    # -------------------------
    # PROCESS + ANALYSE EVENT
    # -------------------------

    def analyse_event(self, event):

        user_behaviour = self.check_user_behaviour(
            event
        )

        api_behaviour = self.check_api_behaviour(
            event
        )

        # IMPORTANT:
        # Analyse BEFORE updating the state.
        # This prevents the current event from
        # becoming part of its own baseline.

        result = {
            "user": user_behaviour,
            "api": api_behaviour
        }

        self.process_event(event)

        return result

    # -------------------------
    # GET USER
    # -------------------------

    def get_user(self, user_id):

        return self.users.get(user_id)

    # -------------------------
    # GET API
    # -------------------------

    def get_api(self, endpoint):

        return self.apis.get(endpoint)

    # -------------------------
    # SUMMARY
    # -------------------------

    def get_summary(self):

        return {
            "users": len(self.users),
            "apis": len(self.apis),
            "sessions": len(self.sessions)
        }