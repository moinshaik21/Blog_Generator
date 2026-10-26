from rest_framework import serializers


class GenerateBlogSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=300)
    tone = serializers.ChoiceField(
        
        
        choices=["professional", "casual", "humorous", "persuasive"],
        default="professional",
    )
    length = serializers.ChoiceField(
        choices=["short", "medium", "long"],
        default="medium",
    )