from rest_framework import serializers

from . import convert 

class FontFileSerializer(serializers.Serializer):

    """A serializer to validate the font file uploaded"""
    file = serializers.FileField()
    content = serializers.Field()
    content_type = serializers.Field()

    def validate_file(self, attrs, source):
        fileobj = attrs[source]
        filetype = fileobj.content_type
        filepath = fileobj.temporary_file_path()
        if not convert.validate_font(filepath, filetype):
            raise serializers.ValidationError('Invalid font file')
        return attrs

    def save_object(self, obj, *args, **kwargs):
        fileobj = obj['file']
        filetype = fileobj.content_type
        filepath = fileobj.temporary_file_path()

        content = convert.font(filepath)
        self.data['content'] = content
        self.data['content_type'] = filetype
        
class CSSFileSerializer(serializers.Serializer):
    file = serializers.FileField()
    content = serializers.Field()
    content_type = serializers.Field()

    def validate_file(self, attrs, source):
        fileobj = attrs[source]
        filetype = fileobj.content_type
        filepath = fileobj.temporary_file_path()
        if not convert.validate_css(filepath, filetype):
            raise serializers.ValidationError('Invalid css file')
        return attrs

    def save_object(self, obj, *args, **kwargs):
        fileobj = obj['file']
        filetype = fileobj.content_type
        filepath = fileobj.temporary_file_path()

        content = convert.css(filepath)
        self.data['content'] = content
        self.data['content_type'] = filetype
     
class IconFileSerializer(serializers.Serializer):

    """A serializer for simple file upload"""

    file = serializers.FileField()
    content = serializers.Field()
    content_type = serializers.Field()

    def validate_file(self, attrs, source):
        fileobj = attrs[source]
        filetype = fileobj.content_type
        filepath = fileobj.temporary_file_path()

        if filetype == 'image/svg+xml':
            content = convert.icon(filepath)
            if content:
                attrs['content'] = content
                attrs['content_type'] = filetype
                return attrs
        raise serializers.ValidationError('Invalid icon file')

    def save_object(self, *args, **kwargs):
        pass
