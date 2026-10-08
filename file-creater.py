import os, json

IGNORE = {'node_modules', 'dist', '.git', '__pycache__', '.next', 'build'}

def get_tree(dir_path):
    tree = {'name': os.path.basename(dir_path) or dir_path, 'type': 'directory', 'children': []}
    try:
        entries = os.listdir(dir_path)
    except PermissionError:
        return tree
    
    for entry in entries:
        if entry in IGNORE:
            continue
        full_path = os.path.join(dir_path, entry)
        if os.path.isdir(full_path):
            tree['children'].append(get_tree(full_path))
        else:
            tree['children'].append({'name': entry, 'type': 'file'})
    return tree

tree_data = get_tree('.')
with open('new-file-tree.json', 'w', encoding='utf-8') as f:
    json.dump(tree_data, f, indent=2)

print('✅ new-file-tree.json ready!')