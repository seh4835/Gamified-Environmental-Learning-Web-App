#BluePrint Initialization
users_bp = Blueprint("users",__name__)

#get current user profile
@users_bp.route("/me",methods=["GET"])
@jwt_required()
def get_my_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error":"User not found"}), 404
    
    return jsonify({
        "id":user.id,
        "name":user.name,
        "email":user.email,
        "role":user.role,
        "instituion":user.instituion,
        "eco_points":user.eco_points,
        "created_at":user.created_at.isoformat()

    }), 200
