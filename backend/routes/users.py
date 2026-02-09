#BluePrint Initialization
users_bp = Blueprint("users",__name__)

#get current user profile
@users_bp.route("/me",methods=["GET"])
@jwt_required()
