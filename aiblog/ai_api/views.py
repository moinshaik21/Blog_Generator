from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import GenerateBlogSerializer
from .services import generate_blog_post


class GenerateBlogView(APIView):
    def post(self, request):
        serializer = GenerateBlogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            content = generate_blog_post(**serializer.validated_data)
        except Exception as e:
            return Response(
                {"error": f"AI generation failed: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"content": content}, status=status.HTTP_200_OK)