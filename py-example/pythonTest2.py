# coding:utf-8
# -*- coding: utf-8 -*-
import sys
from zipfile import ZipFile
import os
import shutil
import re
reload(sys)
sys.setdefaultencoding('utf8')
def findSubStrIndex(substr, str, time):
    times = str.count(substr)
    if (times == 0) or (times < time):
        pass
    else:
        i = 0
        index = -1
        while i < time:
            index = str.find(substr, index+1)
            i+=1
        return index

def write_comments(comments_file_content, comments):
    comments_id = comments[2]
    print ('generate comments.xml content....')
    tmp = '<w:comment w:id="{}" w:author="qifaxiaUser" w:date="2019-03-13T15:10:06Z" w:initials="Office"><w:p w14:paraId="13BADCAB" w14:textId="3E3425E0" w:rsidR="00734D50" w:rsidRDefault="00000000"><w:r><w:annotationRef/></w:r><w:r><w:rPr><w:rFonts w:hint="eastAsia"/><w:color w:val="00B050"/></w:rPr><w:t>{}</w:t></w:r></w:p></w:comment></w:comments>'.format(comments_id, comments[1], comments_id+1, comments_id+1)
    content_comments = comments_file_content[:-13]+tmp
    return content_comments

def write_document(document_file_content, comments):
    comments_id = comments[2]
    print ('generate document.xml content....')
    tmp = '</w:t></w:r><w:commentRangeStart w:id="{}"/><w:r><w:rPr><w:rFonts w:hint="eastAsia"/></w:rPr><w:t>{}</w:t></w:r><w:commentRangeEnd w:id="{}"/><w:r w:rsidR="00000000"><w:commentReference w:id="{}"/></w:r><w:r><w:rPr><w:rFonts w:hint="eastAsia"/></w:rPr><w:t>'.format(comments_id,comments[0],comments_id,comments_id)

    index = findSubStrIndex(comments[0], document_file_content, 1)
    index2 = findSubStrIndex(comments[0], document_file_content, 2)
    print(index, index2)

    content_document = document_file_content.replace(comments[0],tmp,1)
    return content_document

def write_rel(rel_file_content, comments):
    if rel_file_content.find('comments.xml') == -1:
        print ("not find comments.xml")
        content_rel = rel_file_content[:-16]+'<Relationship Id="{}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="comments.xml"/></Relationships>'.format('rId9')
        print(content_rel)
        return content_rel
    else:
        print('get comments.xml in rels file')
        return rel_file_content

def write_content_types(rel_file_content, content_types_file):
    if rel_file_content.find('comments.xml') == -1:
        tmp = '<Override PartName="/word/comments.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml"/><Override PartName="/word/commentsExtended.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml"/><Override PartName="/word/people.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.people+xml"/></Types>'
        content_types = content_types_file[:-8] + tmp
        return content_types
    return content_types_file
# def write_comments_extended():

def run(file_path, comments):

    doc_file = open(file_path, 'rb')
    doc = ZipFile(doc_file)
    doc.extractall()
    print ('extracting....')
    file_name = doc.namelist()
    if 'word/comments.xml' not in file_name:
        print ('create comments.xml')
        comments_file = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:comments xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14"></w:comments>'
        comments.append(1)
    else:
        comments_file = doc.read('word/comments.xml').decode('utf-8')
        comment_id = re.compile(r'(?<=id=")\d+')
        comment_id = int(max(comment_id.findall(comments_file)))+2
        comments.append(comment_id)
    document_file = doc.read('word/document.xml').decode('utf-8')
    rel_file = doc.read('word/_rels/document.xml.rels').decode('utf-8')
    content_types_file = doc.read('[Content_Types].xml').decode('utf-8')
    doc.close()
    doc_file.close()

    comments_g = write_comments(comments_file, comments)
    document = write_document(document_file, comments)
    comments_extended_file = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w15:commentsEx xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14"><w15:commentEx w15:paraId="13BADCAB" w15:done="0"/></w15:commentsEx>'
    people = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w15:people xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mo="http://schemas.microsoft.com/office/mac/office/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 wp14"><w15:person w15:author="qifaxiaUser"><w15:presenceInfo w15:providerId="None" w15:userId="qifaxiaUser"/></w15:person></w15:people>'
    rel = write_rel(rel_file, comments)
    content_types = write_content_types(rel_file, content_types_file)
    print ('get all content')
    print('writing document.xml.rels...')
    r_f = open('word/_rels/document.xml.rels','w')
    r_f.write(rel)
    r_f.close()
    print('done')
    print ('writing comments.xml...')
    c_f = open('word/comments.xml','w')
    c_f.write(comments_g)
    c_f.close()
    print('done')
    # print ('writing commentsExtended.xml...')
    # e_f = open('word/commentsExtended.xml','w')
    # e_f.write(comments_extended_file)
    # e_f.close()
    # print('done')
    # print ('writing people.xml...')
    # p_f = open('word/people.xml','w')
    # p_f.write(people)
    # p_f.close()
    # print('done')
    print('writing document.xml....')
    d_f = open('word/document.xml','w')
    d_f.write(document)
    d_f.close()
    print('done')
    print('writing [Content_Types].xml....')
    t_f = open('[Content_Types].xml','w')
    t_f.write(content_types)
    t_f.close()
    print('done')
    os.remove(file_path)

    print('create commented docx....')
    new_file = ZipFile(doc.filename,mode='w')
    if 'word/comments.xml' not in file_name:
        print ('add {}'.format('word/comments.xml'))
        new_file.write('word/comments.xml')
    # if 'word/commentsExtended.xml' not in file_name:
    #     print ('add {}'.format('word/commentsExtended.xml'))
    #     new_file.write('word/commentsExtended.xml')
    # if 'word/people.xml' not in file_name:
    #     print ('add {}'.format('word/people.xml'))
    #     new_file.write('word/people.xml')
    try:
        for name in file_name:
            if os.path.isfile(name):
                print('add {}'.format(name))
                new_file.write(name)
    finally:
        print('closing')
        new_file.close()
    for name in file_name:
        if os.path.exists(name):
            if os.path.isfile(name):
                os.remove(name)
            else:
                shutil.rmtree(name)
    print('done')

if __name__ == '__main__':
    absolute_path = os.path.abspath(__file__)
    print("Full path: " + absolute_path)
    print("Directory Path: " + os.path.dirname(absolute_path))
    file_path = '../pythonTest/py5_codetest.docx'
    text = '3000'
    comment = 'comment2'
    comments = [text,comment]
    print (comments)
    run(file_path,comments)